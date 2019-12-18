'use strict';

const staticLinks = [
  { rel: 'stylesheet', href: 'https://fonts.googleapis.com/icon?family=Material+Icons' },
  { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,400italic' },
  { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Open+Sans:300,400,400i,600,700,800' },
  { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Lato:300,400,400i,700,900' },
];

const staticScripts = [
  {
    type: 'text/javascript',
    src: '//static.filestackapi.com/filestack-js/1.7.7/filestack.min.js'
  }
];

const internalScripts = [
  { content: '(function() { var qs,js,q,s,d=document, gi=d.getElementById, ce=d.createElement, gt=d.getElementsByTagName, id="add_event", b="https://addevent.com/libs/atc/1.6.1/atc.min.js"; if(!gi.call(d,id)) { js=ce.call(d,"script"); js.id=id; js.src=b; js.async=true; js.defer=true; q=gt.call(d,"script")[0]; q.parentNode.insertBefore(js,q) } })()'},
];

function loadScripts({isPublic, production}) {
  staticLinks.forEach((item) => {
    const link = document.createElement('link');
    link.rel = item.rel;
    link.href = item.href;

    document.getElementsByTagName('head')[0].appendChild(link);
  });

  if (!arguments[0].isPublic) {
    staticScripts.forEach((item) => {
      const script = document.createElement('script');
      script.type = item.type;
      script.src = item.src;
      document.getElementsByTagName('head')[0].appendChild(script);
    });

    internalScripts.forEach((item) => {
      const script = document.createElement('script');
      script.textContent = item.content;
      document.getElementsByTagName('head')[0].appendChild(script);
    });
  }
}

module.exports = loadScripts;
