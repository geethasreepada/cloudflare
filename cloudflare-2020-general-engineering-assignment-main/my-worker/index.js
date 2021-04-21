const LINKS = [
  { "name": "My Github", "url": "https://github.com/geethasreepada" },
  { "name": "My Linkedin", "url": "https://www.linkedin.com/in/geetha-sreepada-46805b1a4/" },
  { "name": "Cloudflare company", "url": "https://www.cloudflare.com/about-overview/" }
]

const SOCIALS=[{'name': 'My Linkedin Profile', 'url': 'https://www.linkedin.com/in/geetha-sreepada-46805b1a4/', 'svg': 'https://cdnjs.cloudflare.com/ajax/libs/simple-icons/3.12.0/linkedin.svg'},
{"name": "My Github", "url": "https://github.com/geethasreepada" ,'svg': 'https://cdnjs.cloudflare.com/ajax/libs/simple-icons/3.12.0/github.svg'}
]


const TEMPLATE_URL = "https://static-links-page.signalnerve.workers.dev"
const SUBJECT_NAME = "Hi,Geetha Sreepada here!!"



addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)

  if (url.pathname == "/links" || url.pathname == "/links/") {
    const json = JSON.stringify(LINKS, null, 2)
    return new Response(json, {
      headers: { "content-type": "application/json;charset=UTF-8" },
    })
  }

  const init = {
    headers: {
      "content-type": "text/html;charset=UTF-8",
    },
  }
  const html_template = await fetch(TEMPLATE_URL, init)
  return rewriter.transform(html_template)
}
class BackgroundTransformer {
  async element(element) {
      const gradientStyle = 'background-image: linear-gradient(to right, rgba(255,0,0,0), rgba(255,0,0,1));'
      element.setAttribute('style', gradientStyle)
  }
}
class TextTransformer {
  constructor(content) {
    this.content = content
  }

  async element(element) {
      element.setInnerContent(this.content)
  }
}

class LinksTransformer {
  constructor(links) {
      this.links = links
  }

  async element(element) {
      for (let link of this.links) {
          element.append(this.generateLinkTag(link), { html: true })
      }
  }

  generateLinkTag(link) {
      let tag = "<a href=\"" + link.url + "\">" + link.name + "</a>"
      return tag
  }
}

class SocialLinksTransformer {
  constructor(links) {
    this.links = links
  }

  async element(element) {
      element.removeAttribute("style")
      for (let socialLink of this.links) {
        element.append(this.generateSocialLinkTag(socialLink), { html: true })
      }
  }

  generateSocialLinkTag(link) {
    let tag = "<a href=\"" + link.url + "\">" + "<img src=\"" + link.svg + "\"/>" + "</a>"
    return tag
  }
}


const rewriter = new HTMLRewriter()
  .on("title", new TextTransformer(SUBJECT_NAME))
  .on("body", new BackgroundTransformer())
  .on("div#profile h1#name", new TextTransformer(SUBJECT_NAME))
  .on("div#links", new LinksTransformer(LINKS))
  .on("div#social", new SocialLinksTransformer(SOCIALS))



