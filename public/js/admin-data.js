// Draft / publish / history / messages logic. `fs` is a small storage adapter:
// get(path) set(path,data) del(path) list(collection). Firestore and tests both plug in here.
export function makeAdmin(fs, keep = 10) {
  const LIVE = 'site/content', DRAFT = 'drafts/content';
  const clean = d => { const { _sec, ...x } = d || {}; return x; };
  const live = async () => (await fs.get(LIVE)) || {};

  async function working() {                       // what the dashboard shows and edits
    const d = await fs.get(DRAFT);
    return d ? { data: clean(d), sections: d._sec || [], hasDraft: true } : { data: await live(), sections: [], hasDraft: false };
  }
  async function saveDraft(patch, section) {       // every dashboard change goes here, never to the live site
    const d = (await fs.get(DRAFT)) || { ...(await live()), _sec: [] };
    const sec = new Set(d._sec || []); if (section) sec.add(section);
    await fs.set(DRAFT, { ...d, ...patch, _sec: [...sec] });
  }
  async function snapshot(note) {                  // keep the current live version so it can be restored
    const id = 'h' + String(Date.now()).padStart(15, '0');
    await fs.set('history/' + id, { content: await live(), at: Date.now(), note: note || '' });
    const all = (await fs.list('history')).sort((a, b) => a.id < b.id ? -1 : 1);
    for (const h of all.slice(0, Math.max(0, all.length - keep))) await fs.del('history/' + h.id);
    return id;
  }
  async function publish(note) {
    const d = await fs.get(DRAFT); if (!d) throw new Error('Nothing to publish.');
    await snapshot(note || (d._sec || []).join(', '));
    await fs.set(LIVE, clean(d)); await fs.del(DRAFT);
  }
  const discard = () => fs.del(DRAFT);
  async function history() { return (await fs.list('history')).sort((a, b) => a.id < b.id ? 1 : -1); }
  async function restore(id) {                     // go back to an old version (and keep today's one too)
    const h = await fs.get('history/' + id); if (!h) throw new Error('Version not found.');
    await snapshot('before restore'); await fs.set(LIVE, h.content); await fs.del(DRAFT);
  }
  async function messages() { return (await fs.list('messages')).sort((a, b) => (a.at < b.at ? 1 : -1)); }
  const markRead = async id => { const m = await fs.get('messages/' + id); if (m) await fs.set('messages/' + id, { ...m, read: true }); };
  const removeMsg = id => fs.del('messages/' + id);
  return { working, saveDraft, publish, discard, history, restore, messages, markRead, removeMsg };
}
