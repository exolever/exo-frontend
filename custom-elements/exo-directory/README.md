# [OpenExO Community directory](https://www.openexo.com/community/directory)

## Goal
Custom element to show OpenExO Community

## How to use

Add the script.js and the tag <app-public-directory> in your HTML. 
```html
<app-public-directory domain="http://domain.example.com"></app-public-directory>
```

#### Inputs & Outputs

| name | description |  type  |
|------| ----------- | ------ |
| domain | Domain to get API data and build members public profile url | @Input() |

## Development

#### Getting started
- Run `npm install` to install dependencies.
- Run `npm start` to serve the demo app in a dev server.
- Navigate to `http://localhost:4200/`.
- The app will automatically reload if you change any of the source files.

If you want test specifics domain go to index.html and modify the input property of `<app-public-directory>` tag.
