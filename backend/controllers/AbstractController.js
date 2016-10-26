class AbstractController {

  constructor(request, response,services) {
    this.request = request;
    this.response = response;
    Object.keys(services || {}).forEach((service) => {
      this[service] = new services[Service]({request,response});
    });
  }

}

module.exports = AbstractController;
