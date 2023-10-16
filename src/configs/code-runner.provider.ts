import { SUPPORTED_LANGUAGES } from "../common/supported-languege";
import { GCC12Runner } from "../services/cod-runner/GCC12-runner";
import { ICodeRunner } from "../services/cod-runner/interfaces/cod-runner.interface";
import { Java17Runner } from "../services/cod-runner/java-17-runner";
import { Python3Runner } from "../services/cod-runner/python-3-runner";

export const CodeRunnerProvider = new Map<SUPPORTED_LANGUAGES, ICodeRunner>();

CodeRunnerProvider.set("python3", new Python3Runner())
CodeRunnerProvider.set("java17", new Java17Runner())
CodeRunnerProvider.set("c12", new GCC12Runner())
