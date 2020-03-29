export const share = (e) => {
  const type = e.currentTarget.getAttribute('share');
  const shareUrl = location.href;
  const width = 600;
  let height = 600;
  const winOptions =
    `menubar=no,toolbar=no,resizable=yes,scrollbars=yes,` + `height=${height},width=${width}`;
  const title = document.title;
  let url;

  switch (type) {
    case 'facebook': {
      height = 229;
      url =
        `https://www.facebook.com/sharer.php?` +
        `u=${encodeURIComponent(shareUrl)}&t=${encodeURIComponent(title)}`;
      break;
    }
    case 'twitter': {
      height = 253;
      const text = `Check out ${title} at #{$ hashtag $}: ${shareUrl}`;
      url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
      break;
    }
    default:
      return;
  }
  window.open(url, 'share', winOptions);
};
