const PROTOCOL_REGEXP = /[a-z][a-z\d+\-.]+:\/\//;
const MULTIPLE_SLASH_REGEXP = /\/{2,}/g;

const stripSlashes = (pathname: string) => pathname.replace(MULTIPLE_SLASH_REGEXP, '/');

export const normalizeUrl = (url: string) => {
  if (url.startsWith('data:')) {
    return url;
  }

  const protocolMatch = PROTOCOL_REGEXP.exec(url);
  if (!(protocolMatch && protocolMatch[0])) {
    return stripSlashes(url);
  }

  const [protocol] = protocolMatch;
  const protocolEndIndex = protocolMatch.index + protocol.length;

  return `${url.slice(0, protocolEndIndex)}${stripSlashes(url.slice(protocolEndIndex))}`;
};
