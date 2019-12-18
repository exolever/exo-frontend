# OpenExO
This repository implements the interface for OpenExO platform.


### Installing
For avoiding problems, you should have a node version higher than 7.0 If you have one installed and want to install the latest:
```bash
npm install -g npm-check-updates
```
This program is for check updates for package.json libraries. For more info, visit https://www.npmjs.com/package/npm-check-updates

We use `angular-cli` as command line interface to manage Angular components. You have to install it globally:

```bash
npm uninstall -g angular-cli
npm cache clean
npm install -g angular-cli@latest
```
The last step is to install local packages for this repository (in the repository folder):

```bash
rm -rf ./node_modules
npm install
```

### Configuration files

App-wide configuration properties and settings ought to be stored in the environments file (src/environments/environment.ts).
There are two of these files, one specifically directed to the production environment (environment.prod.ts),
and the second one which provides the environment variables for development environment (environment.ts), please,
keep in mind to place the variables in the proper environment depending on the use case that they should satisfy.

Keep in mind that if you develop some code that refers any new configuration variable, please, add the new variable to the right file.n marked up with tags
> or formatting instructions.

This text you see here is *actually* written in Markdown! To get a feel for Markdown's syntax, type some text into the left window and watch the results in the right.

## Mandatory Rules
There are a some rules for any devoloper who write one code line in this repository:
* If you are a reviewer in a pull-request, please, have time to review it and be critic with the code.
* It's not the code (or the bug) of other one, it's **our** code
* If you find/fix a bug, think about related things/issues and make test which cover it.
* Follow the boyscout's rule
* If you doubt, KISS (Keept It Simply, Stupid)

### GIT configuration
Please, execute the following commands in your project folder (after init Git repository).
```bash
git config commit.template ./src/scripts/pull-request-template.txt
```

### Custom elements

The custom-elements are located under the folder custom-elements, after building in the pipeline you can access them in the url:

https://cdn.openexo.com/bundles/exo-frontend/<SOURCE_NAME>/custom-elements/<CUSTOM_ELEMENT>/index.html

for example, to access exo-certification in master:

https://cdn.openexo.com/bundles/exo-frontend/master/custom-elements/exo-certification/index.html

