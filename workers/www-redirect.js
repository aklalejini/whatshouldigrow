export default {
  fetch(request) {
    const url = new URL(request.url);
    url.protocol = "https:";
    url.hostname = "plantbyzip.com";
    return Response.redirect(url.toString(), 301);
  }
};
