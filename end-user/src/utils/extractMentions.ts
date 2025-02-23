export function extractMentions(value: string) {
    const regex = /@\[(.+?)\]\((.+?)\)/g;
    const mentions = [];
    let match;
    while ((match = regex.exec(value)) !== null) {
      mentions.push({ display: match[1], id: match[2] });
    }
    return mentions;
  }
  