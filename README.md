<p align="center">
	<a href="https://checkit.club" alt="Check It Out webpage">
		<img src="https://cdn.rawgit.com/jwu910/check-it-out/7adf00b2/assets/logo-type.svg" alt="Check It Out Logo" width="500" />
	</a>
</p>

<p align="center">
	<a href="https://www.firsttimersonly.com/">
		<img alt="first-timers-only" src="https://img.shields.io/badge/first--timers--only-friendly-blue.svg?style=flat-square)">
	</a>
	<a href="https://travis-ci.org/jwu910/check-it-out">
		<img alt="Build Status" src="https://travis-ci.org/jwu910/check-it-out.svg?branch=master">
	</a>
	<a href="https://www.npmjs.org/package/check-it-out">
		<img alt="Downloads per week" src="https://img.shields.io/npm/dw/localeval.svg">
	</a>
	<a href="https://badge.fury.io/js/check-it-out">
		<img alt="npm version" src="https://badge.fury.io/js/check-it-out.svg">
	</a>
	<a href="https://badge.fury.io/gh/jwu910%2Fcheck-it-out">
		<img alt="GitHub version" src="https://badge.fury.io/gh/jwu910%2Fcheck-it-out.svg">
	</a>
	<a href="https://lgtm.com/projects/g/jwu910/check-it-out/alerts/">
		<img alt="Total alerts" src="https://img.shields.io/lgtm/alerts/g/jwu910/check-it-out.svg?logo=lgtm&logoWidth=18"/>
	</a>
	<a href="https://codeclimate.com/github/jwu910/check-it-out/maintainability">
		<img alt="Code Climate Score" src="https://api.codeclimate.com/v1/badges/e2d8564876becd663ff9/maintainability">
	</a>
	<a href="https://twitter.com/intent/tweet?text=Check%20out%20this%20project%20on%20Github%20https://github.com/jwu910/check-it-out">
		<img alt="Tweet" src="https://img.shields.io/twitter/url/http/shields.io.svg?style=social">
	</a>
</p>

<a href="https://www.buymeacoffee.com/jwu910" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/white_img.png" alt="Buy Me A Coffee" style="height: auto !important; width: auto !important; ></a>

<hr/>
<img src="assets/images/checkit-intro.gif">

Check it out, before you checkout.

Check It Out lets you interactively see and choose what branch you want to check out without the hassle of trying to type out a long or confusing branch name. Checking out branches just got even simpler!

## Requirements
[Node >= v6.0](https://nodejs.org/en/blog/release/v6.0.0/)

[Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) - Required for core features

## Compatibility
Check It Out currently has known issues with Windows. Some users have reported it working while others have reported that it does not. It is built and tested mostly in an Arch Linux environment with some user testing on MacOS and other Linux distributions. We're currently looking for help figuring out why Check It Out is unstable on Windows. See [CIO-128](https://github.com/jwu910/check-it-out/issues/128)

## Installation
We're on [NPM!](https://www.npmjs.org/package/check-it-out)
```
npm install -g check-it-out
```

### Installing from source
[Fork](https://github.com/jwu910/check-it-out#fork-destination-box) or clone the repository
```
git clone https://github.com/jwu910/check-it-out.git
```

Navigate to your repository directory and run
```
npm install
```

Create a symbolic link to the entry point

In the repository directory run:
```
npm link
```

## Local development
From your repository directory run
```
npm run build
```

To start the application you can run
```
node index.js
```
or
```
npm start
```

If you want to test your local build in other repositories, you can use `npm link` which will let you run your local build files with the `cio` or `checkit` aliases.

## Usage
To get started, just run:
```
checkit
```

or

```
cio
```

![Check It Out Usage](assets/images/checkit-usage.gif)

## Features

See a git log for the highlighted ref by pressing <kbd>SPACE</kbd>

![Quick Git Log!](assets/images/checkit-log.gif)


| Commands                                                         | Description                         |
| ---------------------------------------------------------------- | ----------------------------------- |
| <kbd>j</kbd>/<kbd>k</kbd>, <kbd>&#9660;</kbd>/<kbd>&#9650;</kbd> | Navigate the list                   |
| <kbd>h</kbd>/<kbd>l</kbd>, <kbd>&#9668;</kbd>/<kbd>&#9658;</kbd> | Previous/Next remote                |
| <kbd>Ctrl</kbd>+<kbd>r</kbd>                                     | Refresh list with a fetch and prune |
| <kbd>enter</kbd>                                                 | Select highlighted item             |
| <kbd>space</kbd>                                                 | Git log                             |
| <kbd>q</kbd>, <kbd>Ctrl</kbd>+<kbd>c</kbd>, <kbd>esc</kbd>       | Quit                                |

## Settings
Git log argument validation is planned, but not finished. Currently, if the git log fails, <kbd>space</kbd> should not crash the app, but the process should not spawn at all.

Configurable settings can be found at `~/.config/configstore/check-it-out.json`

Options include:
* gitLogArguments
	* Type: Array
	* Default: `['--color=always', '--pretty=format:%C(yellow)%h %Creset%s%Cblue [%cn] %Cred%d ']`
	* Array of strings of valid git log arguments.
* sort
	* Type: String
	* Default: -committerdate
	* Sort references by latest commit date. Value must be a valid sort key or Check It Out will break on start.
* themeColor
	* Type: String
	* Default: `#FFA66D`
	* A hex color code to style Check It Out

To reset Check It Out to its original configurations listed above, start with the flag `--reset-config`:

```
checkit --reset-config
```

## Contributing
Please refer to the [Contributing Guidelines](./CONTRIBUTING.md) before contributing.

See the rest of our [issues](https://github.com/jwu910/check-it-out/issues)

## Contributors
This project wouldn't have been possible with the help so many contributors both in and out of the source code. I look forward to working with you as this project continues to evolve and improve.

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
| [<img src="https://avatars0.githubusercontent.com/u/29239201?v=4" width="80px;"/><br /><sub><b>Brandon Benefield</b></sub>](https://www.bbenefield.com)<br />[📖](https://github.com/jwu910/check-it-out/commits?author=bbenefield89 "Documentation") | [<img src="https://avatars1.githubusercontent.com/u/32409546?v=4" width="80px;"/><br /><sub><b>Aaron Casanova</b></sub>](https://github.com/casyjs)<br />[💻](https://github.com/jwu910/check-it-out/commits?author=casyjs "Code") | [<img src="https://avatars1.githubusercontent.com/u/6403097?v=4" width="80px;"/><br /><sub><b>Drew Brokke</b></sub>](https://github.com/drewbrokke)<br />[💻](https://github.com/jwu910/check-it-out/commits?author=drewbrokke "Code") [🤔](#ideas-drewbrokke "Ideas, Planning, & Feedback") | [<img src="https://avatars3.githubusercontent.com/u/35710155?v=4" width="80px;"/><br /><sub><b>Johanna Tchon</b></sub>](https://github.com/jotchon)<br />[💻](https://github.com/jwu910/check-it-out/commits?author=jotchon "Code") | [<img src="https://avatars1.githubusercontent.com/u/18720522?v=4" width="80px;"/><br /><sub><b>Jenell Pizarro</b></sub>](https://www.jenellpizarro.com/)<br />[📖](https://github.com/jwu910/check-it-out/commits?author=nellarro "Documentation") | [<img src="https://avatars2.githubusercontent.com/u/34019925?v=4" width="80px;"/><br /><sub><b>Rebecca Hong</b></sub>](http://www.linkedin.com/in/rehong)<br />[🎨](#design-rebeccahongsf "Design") | [<img src="https://avatars3.githubusercontent.com/u/25625490?v=4" width="80px;"/><br /><sub><b>Jesse Ma</b></sub>](https://github.com/jma26)<br />[💻](https://github.com/jwu910/check-it-out/commits?author=jma26 "Code") |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| [<img src="https://avatars2.githubusercontent.com/u/16655146?v=4" width="80px;"/><br /><sub><b>Kien Do</b></sub>](https://github.com/kienD)<br />[💬](#question-kienD "Answering Questions") [🐛](https://github.com/jwu910/check-it-out/issues?q=author%3AkienD "Bug reports") [🤔](#ideas-kienD "Ideas, Planning, & Feedback") | [<img src="https://avatars2.githubusercontent.com/u/1088312?v=4" width="80px;"/><br /><sub><b>Vu Tran</b></sub>](http://twitter.com/tranvu)<br />[💬](#question-vutran "Answering Questions") [📖](https://github.com/jwu910/check-it-out/commits?author=vutran "Documentation") [🤔](#ideas-vutran "Ideas, Planning, & Feedback") [📢](#talk-vutran "Talks") | [<img src="https://avatars3.githubusercontent.com/u/12107963?v=4" width="80px;"/><br /><sub><b>Efrain 'Rain' Rivas</b></sub>](https://github.com/rainrivas)<br />[💬](#question-rainrivas "Answering Questions") [🐛](https://github.com/jwu910/check-it-out/issues?q=author%3Arainrivas "Bug reports") [💡](#example-rainrivas "Examples") [🚇](#infra-rainrivas "Infrastructure (Hosting, Build-Tools, etc)") [💻](https://github.com/jwu910/check-it-out/commits?author=rainrivas "Code") [📖](https://github.com/jwu910/check-it-out/commits?author=rainrivas "Documentation") | [<img src="https://avatars3.githubusercontent.com/u/11803331?v=4" width="80px;"/><br /><sub><b>Phuc Le</b></sub>](https://phuchle.com)<br />[💬](#question-phuchle "Answering Questions") [📢](#talk-phuchle "Talks") | [<img src="https://avatars0.githubusercontent.com/u/9248355?v=4" width="80px;"/><br /><sub><b>Can Cellek</b></sub>](http://www.cancellek.com)<br />[💻](https://github.com/jwu910/check-it-out/commits?author=excalith "Code") [📖](https://github.com/jwu910/check-it-out/commits?author=excalith "Documentation") | [<img src="https://avatars1.githubusercontent.com/u/2171796?v=4" width="80px;"/><br /><sub><b>Aras Atasaygin</b></sub>](https://github.com/arasatasaygin)<br />[🎨](#design-arasatasaygin "Design") | [<img src="https://avatars2.githubusercontent.com/u/1387780?v=4" width="80px;"/><br /><sub><b>Donald Lika</b></sub>](https://www.linkedin.com/in/donaldlika1)<br />[💻](https://github.com/jwu910/check-it-out/commits?author=DonaldLika "Code") |
| [<img src="https://avatars0.githubusercontent.com/u/23330646?v=4" width="80px;"/><br /><sub><b>Connor Markwell</b></sub>](https://github.com/9reeno)<br />[💻](https://github.com/jwu910/check-it-out/commits?author=9reeno "Code") | [<img src="https://avatars2.githubusercontent.com/u/25109478?v=4" width="80px;"/><br /><sub><b>ahlaw</b></sub>](https://github.com/ahlaw)<br />[💻](https://github.com/jwu910/check-it-out/commits?author=ahlaw "Code") | [<img src="https://avatars3.githubusercontent.com/u/10486306?v=4" width="80px;"/><br /><sub><b>Kwadwo Busumtwi</b></sub>](https://github.com/supasheva)<br />[📖](https://github.com/jwu910/check-it-out/commits?author=supasheva "Documentation") | [<img src="https://avatars1.githubusercontent.com/u/32243035?v=4" width="80px;"/><br /><sub><b>Dev Kant K Chouhan</b></sub>](https://github.com/devkant)<br />[📖](https://github.com/jwu910/check-it-out/commits?author=devkant "Documentation") | [<img src="https://avatars0.githubusercontent.com/u/11075561?v=4" width="80px;"/><br /><sub><b>Jaya Krishna Namburu</b></sub>](https://github.com/JayaKrishnaNamburu)<br />[💻](https://github.com/jwu910/check-it-out/commits?author=JayaKrishnaNamburu "Code") | [<img src="https://avatars1.githubusercontent.com/u/25116037?v=4" width="80px;"/><br /><sub><b>Céleste Robinson</b></sub>](https://twitter.com/cececodes)<br />[📖](https://github.com/jwu910/check-it-out/commits?author=celesterobinson "Documentation") | [<img src="https://avatars1.githubusercontent.com/u/40876952?v=4" width="80px;"/><br /><sub><b>Juliardi عبدالله</b></sub>](https://abdullah-dev.tech)<br />[💻](https://github.com/jwu910/check-it-out/commits?author=sog01 "Code") |
| [<img src="https://avatars1.githubusercontent.com/u/6044039?v=4" width="80px;"/><br /><sub><b>Omar Roa</b></sub>](https://github.com/Lorsen)<br />[📖](https://github.com/jwu910/check-it-out/commits?author=Lorsen "Documentation") | [<img src="https://avatars2.githubusercontent.com/u/33823673?v=4" width="80px;"/><br /><sub><b>Rachana </b></sub>](https://github.com/rn2293)<br />[💻](https://github.com/jwu910/check-it-out/commits?author=rn2293 "Code") |
<!-- ALL-CONTRIBUTORS-LIST:END -->

### Acknowledgements
Thanks to [@kiend](https://github.com/kiend) for the inspiration and motivation to finish this project. [Check This Out](https://github.com/kiend/check-this-out).

Logo Design by [@arasatasaygin](https://github.com/arasatasaygin) [@openlogos](http://openlogos.org)

### License
MIT @ [Joshua Wu](https://www.npmjs.com/~jwu910)
