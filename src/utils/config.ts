import fs from "node:fs/promises";
import Configstore from "configstore";

export const packageJson = JSON.parse(
  await fs.readFile("package.json", { encoding: "utf-8" }),
);

const defaultConfig = {
  gitLogArguments: [
    "--color=always",
    "--pretty=format:%C(yellow)%h %Creset%s%Cblue [%cn] %Cred%d ",
  ],
  sort: "-committerdate",
  themeColor: "#FFA66D",
};

const conf = new Configstore(packageJson.name, defaultConfig);

export const getGitLogArguments = () => conf.get("gitLogArguments");
export const getSort = () => conf.get("sort");
export const getThemeColor = () => conf.get("themeColor");
export const resetConfig = () => (conf.all = defaultConfig);
