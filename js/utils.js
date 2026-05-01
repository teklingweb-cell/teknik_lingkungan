/* Shared utilities — imported by all pages after supabase-client.js */

/** HTML-escape for text content and attribute values */
function esc(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
/* Aliases used across admin pages */
const escHtml = esc;
const escAttr = esc;
