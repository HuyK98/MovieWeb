import React from "react";

const URL_RE = /(https?:\/\/[^\s]+|www\.[^\s]+)/i;
const escapeRegExp = (s = "") => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// tra ve mang react nodes : text || <a> || <mark>
export default function renderRichText(text = "", keyword = "") {
  const safeText = String(text);
  const partsByUrl = safeText.split(URL_RE);

  const kw = keyword?.trim();
  const kwRe = kw ? new RegExp(`(${escapeRegExp(kw)})`, "gi") : null;

  return partsByUrl.map((frag, i) => {
    if (!frag) return null; //tranh undefined || null

    // linkify
    if (/(https?:\/\/[^\s]+|www\.[^\s]+)/i.test(frag)) {
      const href = frag.startsWith("www") ? `https://${frag}` : frag;
      return (
        <a key={`u${i}`} href={href} target="_blank" rel="noopener noreferrer">
          {frag}
        </a>
      );
    }

    // ko co  keyword -> tra fragment text
    if (!kwRe) return <React.Fragment key={`t${i}`}>{frag}</React.Fragment>;

    // co keyword -> tach thanh text + <mark> tim thay
    const segs = frag.split(kwRe);
    return (
      <React.Fragment key={`h${i}`}>
        {segs.map((s, j) =>
          kwRe.test(s) ? <mark key={`m${i}-${j}`}>{s}</mark> : s
        )}
      </React.Fragment>
    );
  });
}
