import Configstore from "configstore";
import * as packageInfo from "../utils/packageInfo.js";

const defaultConfig = {
  gitLogArguments: [
    "--color=always",
    "--pretty=format:%C(yellow)%h %Creset%s%Cblue [%cn] %Cred%d ",
  ],
  sort: "-committerdate",
  themeColor: "#FFA66D",
};

const conf = new Configstore(packageInfo.name, defaultConfig);

export const getGitLogArguments = () => conf.get("gitLogArguments");
export const getSort = () => conf.get("sort");
export const getThemeColor = () => conf.get("themeColor");
export const resetConfig = () => (conf.all = defaultConfig);
