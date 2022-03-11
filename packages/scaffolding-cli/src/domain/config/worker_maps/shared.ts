import { resolve } from "path"
import terminalLink from "terminal-link"
import {
    BusinessSection,
    CloudSection,
    TerraformSection,
    SourceControlSection,
    NetworkingSection,
} from "../../model/prompt_answer"
import {BuildReplaceInput} from "../file_mapper"

/**
 * TODO: implement a shared inFiles replace to minimize duplication
 * @param projectName
 * @param businessObj
 * @param cloudObj
 * @param terraformObj
 * @param scmObj
 */
export const inFiles = ({
    projectName,
    businessObj,
    cloudObj,
    terraformObj,
    scmObj,
    networkObj
}: {
    projectName: string
    businessObj: BusinessSection
    cloudObj: CloudSection
    terraformObj: TerraformSection
    scmObj: SourceControlSection
    networkObj: NetworkingSection
}): Array<BuildReplaceInput> => {
    return [
        {
            files: ["**/*.md", "**/*.properties"],
            values: {
                "project_name": projectName,
            },
        },
        {
            files: ["**/*-pipeline.yml"],
            values: {
                "stacks-webapp-template/packages/scaffolding-cli/templates":
                    scmObj.repoName || "%REPLACE_ME_FOR_REPO_NAME%",
                "packages/scaffolding-cli/templates/": "",
                "self_repo_tf_src: deploy/azure/infra/stacks-aks":
                    "self_repo_tf_src: deploy/azure/infra",
                "company: amido": `company: ${businessObj.company}`,
                "project: stacks": `project: ${businessObj.project}`,
                "nonprod.amidostacks.internal":
                    "%REPLACE_ME_FOR_INTERNAL_DOMAIN%",
                "prod.amidostacks.internal":
                    "%REPLACE_ME_FOR_INTERNAL_DOMAIN%",
                "amido-stacks-infra-credentials-nonprod":
                    "%REPLACE_ME_FOR_INFRA_SPECIFIC_LIBRARY_VARIABLES%",
                "amido-stacks-infra-credentials-prod":
                    "%REPLACE_ME_FOR_INFRA_SPECIFIC_LIBRARY_VARIABLES%",
                "tf_state_storage: amidostackstfstategbl": `tf_state_storage: ${terraformObj.backendStorage}`,
                "tf_state_rg: amido-stacks-rg-uks": `tf_state_rg: ${terraformObj?.backendStorageRg}`,
                "tf_state_container: tfstate": `tf_state_container: ${terraformObj?.backendStorageContainer}`,
            },
        },
    ]
}

export const introUsageMessage = (): string => {
    return `

███████ ████████  █████   ██████ ██   ██ ███████
██         ██    ██   ██ ██      ██  ██  ██
███████    ██    ███████ ██      █████   ███████
     ██    ██    ██   ██ ██      ██  ██       ██
███████    ██    ██   ██  ██████ ██   ██ ███████
\nBootstrap a templated project webapp, API and/or testing framework with supporting pipelines and infrastructure by answering just a few questions.\n
For more information: https://stacks.amido.com\n
`
}

export const finalResponseMessage = (
    projectName: string,
    message: string,
    ranAdvanced = false,
): string => {
    const dir: string = resolve(process.cwd(), projectName)
    const configFile: string = resolve(dir, `../${projectName}.bootstrap-config.json`)
    const advanced = `* your selected advanced configuration has been saved to ${configFile}. To edit and rerun, see <> for more info.`
    const basic = `your selected configuration and additional project default has been saved to ${configFile}. To change provided default configuration please edit and rerun. See <> for more info`
    return `${message}\
${ranAdvanced ? advanced : basic}
    \n
👟 Next steps: check out your bootstapped project in your chosen development environment
        cd ${dir}

🤓 To get started: open ${dir}/README.md

📖 For guides and supporting information see: https://stacks.amido.com/

💻 Thank you for using the Amido Stacks scaffolding-cli!
         To contribute: https://github.com/amido/stacks
`
}

export const finalErrorMessage = (
    message: string,
    code?: string | number,
): string => {
    const final = `----> \n
Ooooops - Something went wrong \n
error: ${message} \n
${code ? `code: " ${code}` : ""} \n
<----- \n

Please raise a ${terminalLink(
        "bug/issue",
        "https://github.com/amido/stacks-webapp-template/issues",
    )} if you think it's an issue with the CLI \n

Amido Stacks
`
    return final
}
