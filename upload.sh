#!/bin/bash
# 分块推送：先把文本推上去，再把 assets 按 ~600KB 一组逐块推 staging，
# 最后压缩成一个提交推 main（此时所有 blob 已在远端，推送极小）。
set -e
cd "$(dirname "$0")"
export GIT_SSH_COMMAND="ssh -p 443 -o ServerAliveInterval=15"

push_retry() {
  local ref=$1
  for i in 1 2 3 4; do
    if git push origin "$ref" 2>&1; then return 0; fi
    echo "  retry $i..."; sleep 4
  done
  return 1
}

# --- c1: 非资源文件 ---
git read-tree --empty
git add -A -- ':!assets'
P=$(git commit-tree $(git write-tree) -p FETCH_HEAD -m "v0.6.1 part 1: code, docs, text")
git update-ref refs/heads/staging $P
echo ">> pushing part 1 (text)..."
push_retry staging || exit 1

# --- 资源分块 ---
# 按文件大小装箱，每组 <= 600KB
mapfile -t FILES < <(find assets -type f -printf '%s %p\n' | sort -rn)
GROUP=(); GSIZE=0; N=2
flush() {
  [ ${#GROUP[@]} -eq 0 ] && return 0
  git add -- "${GROUP[@]}"
  P=$(git commit-tree $(git write-tree) -p $P -m "v0.6.1 part $N: assets chunk")
  git update-ref refs/heads/staging $P
  echo ">> pushing part $N (${#GROUP[@]} files, ${GSIZE}B)..."
  push_retry staging || exit 1
  GROUP=(); GSIZE=0; N=$((N+1))
}
while read -r size path; do
  GROUP+=("$path"); GSIZE=$((GSIZE+size))
  if [ $GSIZE -ge 600000 ]; then flush; fi
done <<< "$FILES"
flush

# --- 压缩成单个提交推 main ---
S=$(git commit-tree $(git write-tree) -p FETCH_HEAD -m "v0.6.1 — Backlog, loading screen, performance & preload-hang hotfix

- Dialogue backlog (文本回顾) with persistent history, HUD entry
- Chibi running loading screen, random gender expression each time
- Artwork recompressed: package ~12.4MB -> ~6.1MB, idle-time bg warming
- Fix: preloadImage awaited img.decode() which hangs in hidden tabs,
  freezing loading at 0% — decode is now fire-and-forget + 15s watchdog
- Bump all asset URLs to ?v=0.6.1 (data.js was stuck at ?v=0.3.7)
- Latest revised story text (data.js) from the live Netlify deploy
- Repo-ready layout with .nojekyll for GitHub Pages")
git update-ref refs/heads/main $S
echo ">> pushing main (squashed, tiny)..."
push_retry main || exit 1
echo "ALL DONE"
