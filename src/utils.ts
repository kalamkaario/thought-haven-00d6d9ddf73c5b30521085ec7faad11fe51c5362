export function buildThread(comments: any[]) {
  const map = new Map();
  const roots: any[] = [];

  comments.forEach((c) => {
    map.set(c.id, { ...c, replies: [] });
  });

  comments.forEach((c) => {
    if (c.parent_id) {
      map.get(c.parent_id)?.replies.push(map.get(c.id));
    } else {
      roots.push(map.get(c.id));
    }
  });

  return roots;
}
