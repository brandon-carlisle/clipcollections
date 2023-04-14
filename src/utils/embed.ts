const FALLBACK_CLIP = 'SpoopyRoundPonyMcaT-w5zR8yV3LEN_EgzB';

export function generateEmbedLink(url: string) {
  const embed = url.split('/');

  // Url provided will have this structure
  // https://clips.twitch.tv/FlirtyRespectfulHippoNononoCat-1ilnan1f3wSAz9zb
  if (embed.length === 4) {
    const clip = embed[embed.length - 1];
    return `https://clips.twitch.tv/embed?clip=${
      clip || FALLBACK_CLIP
    }&parent=clipcollections.vercel.app`;
  }
  // Otherwise the url provided has this structure
  // https://www.twitch.tv/scump/clip/SpoopyRoundPonyMcaT-w5zR8yV3LEN_EgzB?filter=clips&range=7d&sort=time
  else {
    const clip = embed[embed.length - 1]?.split('?')[0];
    return `https://clips.twitch.tv/embed?clip=${
      clip || FALLBACK_CLIP
    }&parent=clipcollections.vercel.app`;
  }
}
