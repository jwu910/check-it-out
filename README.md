<p align="center">
	<a href="https://checkit.club" alt="Check It Out webpage">
		<img src="https://cdn.rawgit.com/jwu910/check-it-out/7adf00b2/assets/logo-type.svg" alt="Check It Out Logo" width="500" />
	</a>
</p>

<p align="center">
	<a href="http://commitizen.github.io/cz-cli/">
		<img alt="commitizen friendly badge" src="https://img.shields.io/badge/commitizen-friendly-brightgreen.svg">
	</a>
	<a href="https://www.firsttimersonly.com/">
		<img alt="first-timers-only" src="https://img.shields.io/badge/first--timers--only-friendly-blue.svg?style=flat-square)">
	</a>
	<a href="https://travis-ci.org/jwu910/check-it-out">
		<img alt="Build Status" src="https://travis-ci.org/jwu910/check-it-out.svg?branch=main">
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

<div>
	<a href="https://www.buymeacoffee.com/jwu910">
		<img alt="Buy Me A Coffee" src="https://www.buymeacoffee.com/assets/img/custom_images/yellow_img.png" style="height: auto !important; width: auto !important;" />
	</a>
</div>

<hr/>
<img src="assets/images/checkit-intro.gif">

Check it out, before you checkout.

Check It Out lets you interactively see and choose what branch you want to check out without the hassle of trying to type out a long or confusing branch name. Checking out branches just got even simpler!

## Requirements
[Node >= v14](https://nodejs.org/en/blog/release/v14.21.3) - _note:_ developed and tested on Node 14 and up. There isn't a guarantee this will work on earlier versions.

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
node dist/index.js
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


| Commands                                                         | Description                                         |
| ---------------------------------------------------------------- | --------------------------------------------------- |
| <kbd>j</kbd>/<kbd>k</kbd>, <kbd>&#9660;</kbd>/<kbd>&#9650;</kbd> | Navigate the list                                   |
| <kbd>h</kbd>/<kbd>l</kbd>, <kbd>&#9668;</kbd>/<kbd>&#9658;</kbd> | Previous/Next remote                                |
| <kbd>Ctrl</kbd>+<kbd>r</kbd>                                     | Refresh list with a fetch and prune                 |
| <kbd>enter</kbd>                                                 | Select highlighted item                             |
| <kbd>y</kbd>                                                     | Copy highlighted item                               |
| <kbd>space</kbd>                                                 | Git log                                             |
| <kbd>&</kbd>                                                     | Filter lines - enter blank search to show all lines |
| <kbd>/</kbd>                                                     | Search Lines                                        |
| <kbd>n</kbd>                                                     | Jump to next search result                          |
| <kbd>N</kbd>                                                     | Jump to previous search result                      |
| <kbd>q</kbd>, <kbd>Ctrl</kbd>+<kbd>c</kbd>, <kbd>esc</kbd>       | Quit                                                |

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
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://www.bbenefield.com"><img src="https://avatars0.githubusercontent.com/u/29239201?v=4?s=80" width="80px;" alt="Brandon Benefield"/><br /><sub><b>Brandon Benefield</b></sub></a><br /><a href="https://github.com/jwu910/check-it-out/commits?author=bbenefield89" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/casyjs"><img src="https://avatars1.githubusercontent.com/u/32409546?v=4?s=80" width="80px;" alt="Aaron Casanova"/><br /><sub><b>Aaron Casanova</b></sub></a><br /><a href="https://github.com/jwu910/check-it-out/commits?author=casyjs" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/drewbrokke"><img src="https://avatars1.githubusercontent.com/u/6403097?v=4?s=80" width="80px;" alt="Drew Brokke"/><br /><sub><b>Drew Brokke</b></sub></a><br /><a href="https://github.com/jwu910/check-it-out/commits?author=drewbrokke" title="Code">💻</a> <a href="#ideas-drewbrokke" title="Ideas, Planning, & Feedback">🤔</a> <a href="#maintenance-drewbrokke" title="Maintenance">🚧</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/jotchon"><img src="https://avatars3.githubusercontent.com/u/35710155?v=4?s=80" width="80px;" alt="Johanna Tchon"/><br /><sub><b>Johanna Tchon</b></sub></a><br /><a href="https://github.com/jwu910/check-it-out/commits?author=jotchon" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://www.jenellpizarro.com/"><img src="https://avatars1.githubusercontent.com/u/18720522?v=4?s=80" width="80px;" alt="Jenell Pizarro"/><br /><sub><b>Jenell Pizarro</b></sub></a><br /><a href="https://github.com/jwu910/check-it-out/commits?author=nellarro" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://www.linkedin.com/in/rehong"><img src="https://avatars2.githubusercontent.com/u/34019925?v=4?s=80" width="80px;" alt="Rebecca Hong"/><br /><sub><b>Rebecca Hong</b></sub></a><br /><a href="#design-rebeccahongsf" title="Design">🎨</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/jma26"><img src="https://avatars3.githubusercontent.com/u/25625490?v=4?s=80" width="80px;" alt="Jesse Ma"/><br /><sub><b>Jesse Ma</b></sub></a><br /><a href="https://github.com/jwu910/check-it-out/commits?author=jma26" title="Code">💻</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/kienD"><img src="https://avatars2.githubusercontent.com/u/16655146?v=4?s=80" width="80px;" alt="Kien Do"/><br /><sub><b>Kien Do</b></sub></a><br /><a href="#question-kienD" title="Answering Questions">💬</a> <a href="https://github.com/jwu910/check-it-out/issues?q=author%3AkienD" title="Bug reports">🐛</a> <a href="#ideas-kienD" title="Ideas, Planning, & Feedback">🤔</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://twitter.com/tranvu"><img src="https://avatars2.githubusercontent.com/u/1088312?v=4?s=80" width="80px;" alt="Vu Tran"/><br /><sub><b>Vu Tran</b></sub></a><br /><a href="#question-vutran" title="Answering Questions">💬</a> <a href="https://github.com/jwu910/check-it-out/commits?author=vutran" title="Documentation">📖</a> <a href="#ideas-vutran" title="Ideas, Planning, & Feedback">🤔</a> <a href="#talk-vutran" title="Talks">📢</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/rainrivas"><img src="https://avatars3.githubusercontent.com/u/12107963?v=4?s=80" width="80px;" alt="Efrain 'Rain' Rivas"/><br /><sub><b>Efrain 'Rain' Rivas</b></sub></a><br /><a href="#question-rainrivas" title="Answering Questions">💬</a> <a href="https://github.com/jwu910/check-it-out/issues?q=author%3Arainrivas" title="Bug reports">🐛</a> <a href="#example-rainrivas" title="Examples">💡</a> <a href="#infra-rainrivas" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/jwu910/check-it-out/commits?author=rainrivas" title="Code">💻</a> <a href="https://github.com/jwu910/check-it-out/commits?author=rainrivas" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://phuchle.com"><img src="https://avatars3.githubusercontent.com/u/11803331?v=4?s=80" width="80px;" alt="Phuc Le"/><br /><sub><b>Phuc Le</b></sub></a><br /><a href="#question-phuchle" title="Answering Questions">💬</a> <a href="#talk-phuchle" title="Talks">📢</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://www.cancellek.com"><img src="https://avatars0.githubusercontent.com/u/9248355?v=4?s=80" width="80px;" alt="Can Cellek"/><br /><sub><b>Can Cellek</b></sub></a><br /><a href="https://github.com/jwu910/check-it-out/commits?author=excalith" title="Code">💻</a> <a href="https://github.com/jwu910/check-it-out/commits?author=excalith" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/arasatasaygin"><img src="https://avatars1.githubusercontent.com/u/2171796?v=4?s=80" width="80px;" alt="Aras Atasaygin"/><br /><sub><b>Aras Atasaygin</b></sub></a><br /><a href="#design-arasatasaygin" title="Design">🎨</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://www.linkedin.com/in/donaldlika1"><img src="https://avatars2.githubusercontent.com/u/1387780?v=4?s=80" width="80px;" alt="Donald Lika"/><br /><sub><b>Donald Lika</b></sub></a><br /><a href="https://github.com/jwu910/check-it-out/commits?author=DonaldLika" title="Code">💻</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/9reeno"><img src="https://avatars0.githubusercontent.com/u/23330646?v=4?s=80" width="80px;" alt="Connor Markwell"/><br /><sub><b>Connor Markwell</b></sub></a><br /><a href="https://github.com/jwu910/check-it-out/commits?author=9reeno" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/ahlaw"><img src="https://avatars2.githubusercontent.com/u/25109478?v=4?s=80" width="80px;" alt="ahlaw"/><br /><sub><b>ahlaw</b></sub></a><br /><a href="https://github.com/jwu910/check-it-out/commits?author=ahlaw" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/supasheva"><img src="https://avatars3.githubusercontent.com/u/10486306?v=4?s=80" width="80px;" alt="Kwadwo Busumtwi"/><br /><sub><b>Kwadwo Busumtwi</b></sub></a><br /><a href="https://github.com/jwu910/check-it-out/commits?author=supasheva" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/devkant"><img src="https://avatars1.githubusercontent.com/u/32243035?v=4?s=80" width="80px;" alt="Dev Kant K Chouhan"/><br /><sub><b>Dev Kant K Chouhan</b></sub></a><br /><a href="https://github.com/jwu910/check-it-out/commits?author=devkant" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/JayaKrishnaNamburu"><img src="https://avatars0.githubusercontent.com/u/11075561?v=4?s=80" width="80px;" alt="Jaya Krishna Namburu"/><br /><sub><b>Jaya Krishna Namburu</b></sub></a><br /><a href="https://github.com/jwu910/check-it-out/commits?author=JayaKrishnaNamburu" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://twitter.com/cececodes"><img src="https://avatars1.githubusercontent.com/u/25116037?v=4?s=80" width="80px;" alt="Céleste Robinson"/><br /><sub><b>Céleste Robinson</b></sub></a><br /><a href="https://github.com/jwu910/check-it-out/commits?author=celesterobinson" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://abdullah-dev.tech"><img src="https://avatars1.githubusercontent.com/u/40876952?v=4?s=80" width="80px;" alt="Juliardi عبدالله"/><br /><sub><b>Juliardi عبدالله</b></sub></a><br /><a href="https://github.com/jwu910/check-it-out/commits?author=sog01" title="Code">💻</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/Lorsen"><img src="https://avatars1.githubusercontent.com/u/6044039?v=4?s=80" width="80px;" alt="Omar Roa"/><br /><sub><b>Omar Roa</b></sub></a><br /><a href="https://github.com/jwu910/check-it-out/commits?author=Lorsen" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/rn2293"><img src="https://avatars2.githubusercontent.com/u/33823673?v=4?s=80" width="80px;" alt="Rachana "/><br /><sub><b>Rachana </b></sub></a><br /><a href="https://github.com/jwu910/check-it-out/commits?author=rn2293" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/aksappy"><img src="https://avatars1.githubusercontent.com/u/4348461?v=4?s=80" width="80px;" alt="aksappy"/><br /><sub><b>aksappy</b></sub></a><br /><a href="https://github.com/jwu910/check-it-out/issues?q=author%3Aaksappy" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/mahendraHegde"><img src="https://avatars0.githubusercontent.com/u/22556323?v=4?s=80" width="80px;" alt="Mahendra Kumar"/><br /><sub><b>Mahendra Kumar</b></sub></a><br /><a href="https://github.com/jwu910/check-it-out/commits?author=mahendraHegde" title="Code">💻</a> <a href="https://github.com/jwu910/check-it-out/commits?author=mahendraHegde" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/a-camarillo"><img src="https://avatars.githubusercontent.com/u/58638902?v=4?s=80" width="80px;" alt="Anthony Camarillo"/><br /><sub><b>Anthony Camarillo</b></sub></a><br /><a href="https://github.com/jwu910/check-it-out/commits?author=a-camarillo" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://tdhc.uk"><img src="https://avatars.githubusercontent.com/u/16925654?v=4?s=80" width="80px;" alt="TheCoolBlackCat"/><br /><sub><b>TheCoolBlackCat</b></sub></a><br /><a href="https://github.com/jwu910/check-it-out/commits?author=TheCoolBlackCat" title="Code">💻</a> <a href="https://github.com/jwu910/check-it-out/commits?author=TheCoolBlackCat" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://catherinenjenga.github.io/"><img src="https://avatars.githubusercontent.com/u/87461018?v=4?s=80" width="80px;" alt="Catherine Njenga"/><br /><sub><b>Catherine Njenga</b></sub></a><br /><a href="https://github.com/jwu910/check-it-out/commits?author=CatherineNjenga" title="Documentation">📖</a></td>
	</tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="http://jimmyvu.co"><img src="https://avatars.githubusercontent.com/u/88172055?v=4?s=80" width="80px;" alt="Jimmy Vu"/><br /><sub><b>Jimmy Vu</b></sub></a><br /><a href="https://github.com/jwu910/check-it-out/commits?author=Jimmy-Vu" title="Documentation">📖</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

### Acknowledgements
[@drewbrokke](https://github.com/drewbrokke) was the initial spark that inspired the creation of this project and encouraged me to let me curiosity drive this forward.
[@kiend](https://github.com/kiend) gave me the inspiration and motivation to finish this project after letting it sit for so long. [Check This Out](https://github.com/kiend/check-this-out). Thank you both for the encouragement and support through my career.

Logo Design by [@arasatasaygin](https://github.com/arasatasaygin) [@openlogos](http://openlogos.org)

### License
MIT @ [Joshua Wu](https://www.npmjs.com/~jwu910)
