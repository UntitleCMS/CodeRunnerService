import dotenv from "dotenv"
import path from "path";
dotenv.config();

export const environment = {

  CODE_REPO : process.env.CODE_REPO ?? path.join(__dirname, "../../", '/CompilerContainer/SourceCode'),

  SLAVE_USER_NAME : process.env.SLAVE_USER_NAME ?? "runner",
  SLAVE_HOST_PYTHON: process.env.SLAVE_HOST_PYTHON ?? "python-slave"

}
