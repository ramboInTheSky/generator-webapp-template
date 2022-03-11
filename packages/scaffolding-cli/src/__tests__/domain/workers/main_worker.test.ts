/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable compat/compat */
import { startCase } from "lodash"
import { CliAnswerModel, JavaCliAnswerModel } from "../../../domain/model/prompt_answer"
import { CliResponse, BaseResponse } from "../../../domain/model/workers"
import { MainWorker } from "../../../domain/workers/main_worker"
import { Utils } from "../../../domain/workers/utils"
import conf from "../../../domain/config/static.config.json"
import { Static } from "../../../domain/model/config"

const staticConf: Static = conf as Static

jest.mock("../../../domain/workers/utils")

// TODO: parametise these tests

const mockAnswerSsr = {
    projectName: "foo",
    projectType: "ssr",
    platform: "aks",
    deployment: "azdevops",
    business: {
        company: "testcomp",
        domain: "testDomain",
        project: "javaSpring",
    },
    sourceControl: {
        repoName: "test-repo"
    },
    networking: {
        baseDomain: "foo.me.org"
    },
    terraform: {
        backendStorage: "azureBlob"
    },
    cloud: {
        region: "northeurope"
    }
} as CliAnswerModel

const mockAnswerSsrGke = {
    projectName: "foo",
    projectType: "ssr",
    platform: "gke",
    deployment: "azdevops",
    business: {
        company: "testcomp",
        domain: "testDomain",
        project: "javaSpring",
    },
    sourceControl: {
        repoName: "test-repo"
    },
    networking: {
        baseDomain: "foo.me.org"
    },
    terraform: {
        backendStorage: "azureBlob"
    },
    cloud: {
        region: "northeurope"
    }
} as CliAnswerModel

const mockAnswerSsrGkeJenkins = {
    projectName: "foo",
    projectType: "ssr",
    platform: "gke",
    deployment: "jenkins",
    business: {
        company: "testcomp",
        domain: "testDomain",
        project: "javaSpring",
    },
    sourceControl: {
        repoName: "test-repo"
    },
    networking: {
        baseDomain: "foo.me.org"
    },
    terraform: {
        backendStorage: "azureBlob"
    },
    cloud: {
        region: "northeurope"
    }
} as CliAnswerModel

const mockAnswerCsr = {
    projectName: "foo",
    projectType: "csr",
    platform: "aks",
    deployment: "azdevops",
    business: {
        company: "testcomp",
        domain: "testDomain",
        project: "javaSpring",
    },
    sourceControl: {
        repoName: "test-repo"
    },
    networking: {
        baseDomain: "foo.me.org"
    },
    terraform: {
        backendStorage: "azureBlob"
    },
    cloud: {
        region: "northeurope"
    }
} as CliAnswerModel

const mockAnswerJavaSpringAksTfs = {
    projectName: "foo",
    projectType: "javaspring",
    platform: "aks",
    deployment: "azdevops",
    business: {
        company: "testcomp",
        domain: "testDomain",
        project: "javaSpring",
    },
    sourceControl: {
        repoName: "test-repo"
    },
    networking: {
        baseDomain: "foo.me.org"
    },
    terraform: {
        backendStorage: "azureBlob"
    },
    cloud: {
        region: "northeurope"
    },
    javaspring: {
        namespace: "foo.bar"
    },
} as JavaCliAnswerModel

const mockAnswerJavaSpringAksJenkins = {
    projectName: "foo",
    projectType: "javaspring",
    platform: "aks",
    deployment: "jenkins",
    business: {
        company: "testcomp",
        domain: "testDomain",
        project: "javaSpring",
    },
    sourceControl: {
        repoName: "test-repo"
    },
    networking: {
        baseDomain: "foo.me.org"
    },
    terraform: {
        backendStorage: "azureBlob"
    },
    javaspring: {
        namespace: "foo.bar"
    }
} as JavaCliAnswerModel

const mockAnswerNetcore = {
    projectName: "foo",
    projectType: "netcore",
    platform: "aks",
    deployment: "azdevops",
    business: {
        company: "testcomp",
        domain: "testDomain",
        project: "netcore",
    },
    sourceControl: {
        repoName: "test-repo"
    },
    networking: {
        baseDomain: "foo.me.org"
    },
    terraform: {
        backendStorage: "azureBlob"
    },
    cloud: {
        region: "northeurope"
    }
} as CliAnswerModel

const workerResponse = {
    message: `${mockAnswerSsr.projectName} created`,
    ok: true,
} as BaseResponse

const mainWorker = new MainWorker()
Utils.writeOutConfigFile = jest.fn().mockImplementationOnce(() => {
    return Promise.resolve({})
})

describe("mainWorker class tests", () => {
    describe("Positive assertions", () => {
        beforeEach(async () => {})

        it("ssrAksTfs should return success and user message for npm", async () => {
            Utils.doGitClone = jest.fn().mockImplementationOnce(() => {
                return Promise.resolve({message: `foo`})
            })
            Utils.prepBase = jest.fn().mockImplementationOnce(() => {
                return Promise.resolve({
                    message: `${mockAnswerSsr.projectName} created`,
                    tempPath: "/var/test",
                    finalPath: "/opt/myapp",
                })
            })
            Utils.constructOutput = jest.fn().mockImplementationOnce(() => {
                return Promise.resolve(workerResponse)
            })
            Utils.valueReplace = jest.fn().mockImplementationOnce(() => {
                return Promise.resolve(workerResponse)
            })
            const flowRan: CliResponse = await mainWorker.ssrAksTfs(
                mockAnswerSsr,
            )
            expect(Utils.prepBase).toHaveBeenCalled()
            expect(Utils.doGitClone).toHaveBeenCalledWith(
                staticConf.ssr.gitRepo,
                "/var/test",
                staticConf.ssr.localPath,
                staticConf.ssr.gitRef,
            )
            expect(Utils.constructOutput).toHaveBeenCalled()
            expect(flowRan).toHaveProperty("message")
            expect(flowRan).toHaveProperty("ok")
            expect(flowRan.ok).toBe(true)
            expect(flowRan.message).toMatch(`Created React SSR in`)
        })

        it("ssrGkeTfs should return success and user message for npm", async () => {
            Utils.prepBase = jest.fn().mockImplementationOnce(() => {
                return Promise.resolve({
                    message: `${mockAnswerSsrGke.projectName} created`,
                    tempPath: "/var/test",
                    finalPath: "/opt/myapp",
                })
            })
            Utils.constructOutput = jest.fn().mockImplementationOnce(() => {
                return Promise.resolve(workerResponse)
            })
            Utils.valueReplace = jest.fn().mockImplementationOnce(() => {
                return Promise.resolve(workerResponse)
            })
            const flow_ran: CliResponse = await mainWorker.ssrGkeTfs(
                mockAnswerSsrGke,
            )
            expect(Utils.prepBase).toHaveBeenCalled()
            expect(Utils.constructOutput).toHaveBeenCalled()
            expect(flow_ran).toHaveProperty("message")
            expect(flow_ran).toHaveProperty("ok")
            expect(flow_ran.ok).toBe(true)
            expect(flow_ran.message).toMatch(
                `cd ${mockAnswerSsrGke.projectName}/src && npm install && npm run build && npm run start`,
            )
        })

        it("ssrGkeJenkins should return success and user message for npm", async () => {
            Utils.prepBase = jest.fn().mockImplementationOnce(() => {
                return Promise.resolve({
                    message: `${mockAnswerSsrGkeJenkins.projectName} created`,
                    tempPath: "/var/test",
                    finalPath: "/opt/myapp",
                })
            })
            Utils.constructOutput = jest.fn().mockImplementationOnce(() => {
                return Promise.resolve(workerResponse)
            })
            Utils.valueReplace = jest.fn().mockImplementationOnce(() => {
                return Promise.resolve(workerResponse)
            })
            const flow_ran: CliResponse = await mainWorker.ssrGkeJenkins(
                mockAnswerSsrGkeJenkins,
            )
            expect(Utils.prepBase).toHaveBeenCalled()
            expect(Utils.constructOutput).toHaveBeenCalled()
            expect(flow_ran).toHaveProperty("message")
            expect(flow_ran).toHaveProperty("ok")
            expect(flow_ran.ok).toBe(true)
            expect(flow_ran.message).toMatch(
                `cd ${mockAnswerSsrGke.projectName}/src && npm install && npm run build && npm run start`,
            )
        })

        it("infraAksAzdevops should return success and user message for infra only", async () => {
            Utils.doGitClone = jest.fn().mockImplementationOnce(() => {
                return Promise.resolve({message: `foo`})
            })
            Utils.prepBase = jest.fn().mockImplementationOnce(() => {
                return Promise.resolve({
                    message: `${mockAnswerSsr.projectName} created`,
                    tempPath: "/var/test",
                    finalPath: "/opt/myapp",
                })
            })
            Utils.constructOutput = jest.fn().mockImplementationOnce(() => {
                return Promise.resolve(workerResponse)
            })
            Utils.valueReplace = jest.fn().mockImplementationOnce(() => {
                return Promise.resolve(workerResponse)
            })
            const flow_ran: CliResponse = await mainWorker.infraAksAzdevops(
                mockAnswerSsr,
            )
            expect(Utils.prepBase).toHaveBeenCalled()
            expect(Utils.doGitClone).toHaveBeenCalledWith(
                staticConf.aksInfra.gitRepo,
                "/var/test",
                staticConf.aksInfra.localPath,
                staticConf.aksInfra.gitRef,
            )
            expect(Utils.constructOutput).toHaveBeenCalled()
            expect(flow_ran).toHaveProperty("message")
            expect(flow_ran).toHaveProperty("ok")
            expect(flow_ran.ok).toBe(true)
            expect(flow_ran.message).toMatch(
                `cd ${mockAnswerSsr.projectName}/deploy`,
            )
        })

        it("csrAksTfs should return success and user message for npm", async () => {
            Utils.doGitClone = jest.fn().mockImplementationOnce(() => {
                return Promise.resolve({message: `foo`})
            })
            Utils.prepBase = jest.fn().mockImplementationOnce(() => {
                return Promise.resolve({
                    message: `${mockAnswerCsr.projectName} created`,
                    tempPath: "/var/test",
                    finalPath: "/opt/myapp",
                })
            })
            Utils.constructOutput = jest.fn().mockImplementationOnce(() => {
                return Promise.resolve(workerResponse)
            })
            Utils.valueReplace = jest.fn().mockImplementationOnce(() => {
                return Promise.resolve(workerResponse)
            })

            const flow_ran: CliResponse = await mainWorker.csrAksTfs(
                mockAnswerCsr,
            )
            expect(Utils.prepBase).toHaveBeenCalled()
            expect(Utils.doGitClone).toHaveBeenCalledWith(
                staticConf.csr.gitRepo,
                "/var/test",
                staticConf.csr.localPath,
                staticConf.csr.gitRef,
            )
            expect(Utils.constructOutput).toHaveBeenCalled()
            expect(flow_ran).toHaveProperty("message")
            expect(flow_ran).toHaveProperty("ok")
            expect(flow_ran.ok).toBe(true)
            expect(flow_ran.message).toMatch(
                `cd ${mockAnswerCsr.projectName}/src && npm install && npm run start`,
            )
        })

        it("netcoreAksTfs should return success and user message for npm", async () => {
            Utils.doGitClone = jest.fn().mockImplementationOnce(() => {
                return Promise.resolve({message: `foo`})
            })
            Utils.prepBase = jest.fn().mockImplementationOnce(() => {
                return Promise.resolve({
                    message: `${mockAnswerNetcore.projectName} created`,
                    tempPath: "/var/test",
                    finalPath: "/opt/myapp",
                })
            })
            Utils.constructOutput = jest.fn().mockImplementationOnce(() => {
                return Promise.resolve(workerResponse)
            })
            Utils.valueReplace = jest.fn().mockImplementationOnce(() => {
                return Promise.resolve(workerResponse)
            })
            Utils.fileNameReplace = jest.fn().mockImplementationOnce(() => {
                return Promise.resolve(workerResponse)
            })

            const flow_ran: CliResponse = await mainWorker.netcoreAksTfs(
                mockAnswerNetcore,
            )
            expect(Utils.prepBase).toHaveBeenCalled()
            expect(Utils.doGitClone).toHaveBeenCalledWith(
                staticConf.netcore.gitRepo,
                "/var/test",
                staticConf.netcore.localPath,
                staticConf.netcore.gitRef,
            )
            expect(Utils.constructOutput).toHaveBeenCalled()
            expect(flow_ran).toHaveProperty("message")
            expect(flow_ran).toHaveProperty("ok")
            expect(flow_ran.ok).toBe(true)
            expect(flow_ran.message).toMatch(
                `cd ${mockAnswerNetcore.projectName}/src`,
            )
            expect(flow_ran.message).toMatch(`dotnet clean && dotnet restore`)
        })

        it("javaSpringAksTfs should return success and user message for npm", async () => {
            Utils.doGitClone = jest.fn().mockImplementationOnce(() => {
                return Promise.resolve({message: `foo`})
            })
            Utils.prepBase = jest.fn().mockImplementationOnce(() => {
                return Promise.resolve({
                    message: `${mockAnswerJavaSpringAksTfs.projectName} created`,
                    tempPath: "/var/test",
                    finalPath: "/opt/myapp",
                })
            })
            Utils.constructOutput = jest.fn().mockImplementationOnce(() => {
                return Promise.resolve(workerResponse)
            })
            Utils.valueReplace = jest.fn().mockImplementationOnce(() => {
                return Promise.resolve(workerResponse)
            })

            Utils.fileNameReplace = jest.fn().mockImplementationOnce(() => {
                return Promise.resolve(workerResponse)
            })

            const replaceString = `${mockAnswerJavaSpringAksTfs.javaspring?.namespace.replace(/\./gm, "/")}/${startCase(mockAnswerJavaSpringAksTfs.business.company).toLowerCase().replace(/\s/gm, "")}/${startCase(mockAnswerJavaSpringAksTfs.business.project).toLowerCase().replace(/\s/gm, "")}`
            const searchString = (staticConf.javaSpring.searchValue as string).replace(/\./gm, "/")
            // await Utils.fileNameReplace([`${newDirectory.finalPath}/java/src/main/java`, `${newDirectory.finalPath}/java/src/test/java`],
            //     replaceString, true)

            const flow_ran: CliResponse = await mainWorker.javaSpringAksTfs(
                mockAnswerJavaSpringAksTfs
            )
            expect(Utils.doGitClone).toHaveBeenCalledWith(
                staticConf.javaSpring.gitRepo,
                "/var/test",
                staticConf.javaSpring.localPath,
                staticConf.javaSpring.gitRef,
            )

            expect(Utils.prepBase).toHaveBeenCalled()
            expect(Utils.constructOutput).toHaveBeenCalled()
            expect(Utils.fileNameReplace).toHaveBeenCalled()
            expect(Utils.fileNameReplace).toHaveBeenCalledWith(
                [`/opt/myapp/java/src/main/java`, `/opt/myapp/java/src/test/java`, `/opt/myapp/api-tests/src/test/java`],
                searchString, replaceString, true
            )
            expect(flow_ran).toHaveProperty("message")
            expect(flow_ran).toHaveProperty("ok")
            expect(flow_ran.ok).toBe(true)
            expect(flow_ran.message).toMatch(
                `cd ${mockAnswerJavaSpringAksTfs.projectName}/java`,
            )
            expect(flow_ran.message).toMatch(`./mvnw compile && ./mvnw spring-boot:run`)
        })

        it("javaSpringAksJenkins should return success and user message for npm", async () => {
            Utils.doGitClone = jest.fn().mockImplementationOnce(() => {
                return Promise.resolve({message: `foo`})
            })
            Utils.prepBase = jest.fn().mockImplementationOnce(() => {
                return Promise.resolve({
                    message: `${mockAnswerJavaSpringAksJenkins.projectName} created`,
                    tempPath: "/var/test",
                    finalPath: "/opt/myapp",
                })
            })
            Utils.constructOutput = jest.fn().mockImplementationOnce(() => {
                return Promise.resolve(workerResponse)
            })
            Utils.valueReplace = jest.fn().mockImplementationOnce(() => {
                return Promise.resolve(workerResponse)
            })

            Utils.fileNameReplace = jest.fn().mockImplementationOnce(() => {
                return Promise.resolve(workerResponse)
            })

            const replaceString = `${mockAnswerJavaSpringAksJenkins.javaspring?.namespace.replace(/\./gm, "/")}/${startCase(mockAnswerJavaSpringAksJenkins.business.company).toLowerCase().replace(/\s/gm, "")}/${startCase(mockAnswerJavaSpringAksJenkins.business.project).toLowerCase().replace(/\s/gm, "")}`
            const searchString = (staticConf.javaSpring.searchValue as string).replace(/\./gm, "/")
            // await Utils.fileNameReplace([`${newDirectory.finalPath}/java/src/main/java`, `${newDirectory.finalPath}/java/src/test/java`],
            //     replaceString, true)

            const flow_ran: CliResponse = await mainWorker.javaSpringAksJenkins(
                mockAnswerJavaSpringAksJenkins
            )
            expect(Utils.doGitClone).toHaveBeenCalledWith(
                staticConf.javaSpring.gitRepo,
                "/var/test",
                staticConf.javaSpring.localPath,
                staticConf.javaSpring.gitRef,
            )

            expect(Utils.prepBase).toHaveBeenCalled()
            expect(Utils.constructOutput).toHaveBeenCalled()
            expect(Utils.fileNameReplace).toHaveBeenCalled()
            expect(Utils.fileNameReplace).toHaveBeenCalledWith(
                [`/opt/myapp/java/src/main/java`, `/opt/myapp/java/src/test/java`],
                searchString, replaceString, true
            )
            expect(flow_ran).toHaveProperty("message")
            expect(flow_ran).toHaveProperty("ok")
            expect(flow_ran.ok).toBe(true)
            expect(flow_ran.message).toMatch(
                `cd ${mockAnswerJavaSpringAksJenkins.projectName}/java`,
            )
            expect(flow_ran.message).toMatch(`./mvnw compile && ./mvnw spring-boot:run`)
        })

        it("infraGkeAzdevops should return success and user message for infra only", async () => {
            Utils.prepBase = jest.fn().mockImplementationOnce(() => {
                return Promise.resolve({
                    message: `${mockAnswerSsr.projectName} created`,
                    tempPath: "/var/test",
                    finalPath: "/opt/myapp",
                })
            })
            Utils.constructOutput = jest.fn().mockImplementationOnce(() => {
                return Promise.resolve(workerResponse)
            })
            Utils.valueReplace = jest.fn().mockImplementationOnce(() => {
                return Promise.resolve(workerResponse)
            })
            const flow_ran: CliResponse = await mainWorker.infraGkeAzdevops(
                mockAnswerSsr,
            )
            expect(Utils.prepBase).toHaveBeenCalled()
            expect(Utils.constructOutput).toHaveBeenCalled()
            expect(flow_ran).toHaveProperty("message")
            expect(flow_ran).toHaveProperty("ok")
            expect(flow_ran.ok).toBe(true)
            expect(flow_ran.message).toMatch(
                `cd ${mockAnswerSsr.projectName}/deploy`,
            )
        })

        it("infraGkeJenkins should return success and user message for infra only", async () => {
            Utils.prepBase = jest.fn().mockImplementationOnce(() => {
                return Promise.resolve({
                    message: `${mockAnswerSsr.projectName} created`,
                    tempPath: "/var/test",
                    finalPath: "/opt/myapp",
                })
            })
            Utils.constructOutput = jest.fn().mockImplementationOnce(() => {
                return Promise.resolve(workerResponse)
            })
            Utils.valueReplace = jest.fn().mockImplementationOnce(() => {
                return Promise.resolve(workerResponse)
            })
            const flow_ran: CliResponse = await mainWorker.infraGkeJenkins(
                mockAnswerSsr,
            )
            expect(Utils.prepBase).toHaveBeenCalled()
            expect(Utils.constructOutput).toHaveBeenCalled()
            expect(flow_ran).toHaveProperty("message")
            expect(flow_ran).toHaveProperty("ok")
            expect(flow_ran.ok).toBe(true)
            expect(flow_ran.message).toMatch(
                `cd ${mockAnswerSsr.projectName}/deploy`,
            )
        })
    })

    describe("Negative assertions", () => {
        it("ssr_aks_tfs should return a code of -1 when error occurs", async () => {
            Utils.prepBase = jest.fn().mockImplementationOnce(() => {
                throw new Error("Something weird happened")
            })
            const flow_ran: CliResponse = await mainWorker.ssrAksTfs(
                mockAnswerSsr,
            )
            expect(Utils.prepBase).toHaveBeenCalled()
            expect(flow_ran).toHaveProperty("error")
            expect(flow_ran).toHaveProperty("ok")
            expect(flow_ran.ok).toBe(false)
            expect(flow_ran.error).toBeInstanceOf(Error)
            expect(flow_ran.error).toHaveProperty("stack")
            expect(flow_ran.error).toHaveProperty("message")
        })

        it("netcore_aks_tfs should return a code of -1 when error occurs", async () => {
            Utils.prepBase = jest.fn().mockImplementationOnce(() => {
                throw new Error("Something weird happened")
            })
            const flow_ran: CliResponse = await mainWorker.netcoreAksTfs(
                mockAnswerNetcore,
            )
            expect(Utils.prepBase).toHaveBeenCalled()
            expect(flow_ran).toHaveProperty("error")
            expect(flow_ran).toHaveProperty("ok")
            expect(flow_ran.ok).toBe(false)
            expect(flow_ran.error).toBeInstanceOf(Error)
            expect(flow_ran.error).toHaveProperty("stack")
            expect(flow_ran.error).toHaveProperty("message")
        })

        it("javaSpringAksTfs should return a code of -1 when error occurs", async () => {
            Utils.prepBase = jest.fn().mockImplementationOnce(() => {
                throw new Error("Something weird happened")
            })
            const flow_ran: CliResponse = await mainWorker.javaSpringAksTfs(
                mockAnswerJavaSpringAksTfs,
            )
            expect(Utils.prepBase).toHaveBeenCalled()
            expect(flow_ran).toHaveProperty("error")
            expect(flow_ran).toHaveProperty("ok")
            expect(flow_ran.ok).toBe(false)
            expect(flow_ran.error).toBeInstanceOf(Error)
            expect(flow_ran.error).toHaveProperty("stack")
            expect(flow_ran.error).toHaveProperty("message")
        })

        it("javaSpringAksJenkins should return a code of -1 when error occurs", async () => {
            Utils.prepBase = jest.fn().mockImplementationOnce(() => {
                throw new Error("Something weird happened")
            })
            const flow_ran: CliResponse = await mainWorker.javaSpringAksJenkins(
                mockAnswerJavaSpringAksJenkins,
            )
            expect(Utils.prepBase).toHaveBeenCalled()
            expect(flow_ran).toHaveProperty("error")
            expect(flow_ran).toHaveProperty("ok")
            expect(flow_ran.ok).toBe(false)
            expect(flow_ran.error).toBeInstanceOf(Error)
            expect(flow_ran.error).toHaveProperty("stack")
            expect(flow_ran.error).toHaveProperty("message")
        })

        it("csrAksTfs should return a code of -1 when error occurs", async () => {
            Utils.prepBase = jest.fn().mockImplementationOnce(() => {
                throw new Error("Something weird happened")
            })
            const flow_ran: CliResponse = await mainWorker.csrAksTfs(
                mockAnswerCsr,
            )
            expect(Utils.prepBase).toHaveBeenCalled()
            expect(flow_ran).toHaveProperty("error")
            expect(flow_ran).toHaveProperty("ok")
            expect(flow_ran.ok).toBe(false)
            expect(flow_ran.error).toBeInstanceOf(Error)
            expect(flow_ran.error).toHaveProperty("stack")
            expect(flow_ran.error).toHaveProperty("message")
        })

        it("infraAksAzdevops should return a code of -1 when error occurs", async () => {
            Utils.prepBase = jest.fn().mockImplementationOnce(() => {
                throw new Error("Something weird happened")
            })
            const flow_ran: CliResponse = await mainWorker.infraAksAzdevops(
                mockAnswerSsr,
            )
            expect(Utils.prepBase).toHaveBeenCalled()
            expect(flow_ran).toHaveProperty("error")
            expect(flow_ran).toHaveProperty("ok")
            expect(flow_ran.ok).toBe(false)
            expect(flow_ran.error).toBeInstanceOf(Error)
            expect(flow_ran.error).toHaveProperty("stack")
            expect(flow_ran.error).toHaveProperty("message")
        })

        it("infraGkeAzdevops should return a code of -1 when error occurs", async () => {
            Utils.prepBase = jest.fn().mockImplementationOnce(() => {
                throw new Error("Something weird happened")
            })
            const flow_ran: CliResponse = await mainWorker.infraGkeAzdevops(
                mockAnswerSsr,
            )
            expect(Utils.prepBase).toHaveBeenCalled()
            expect(flow_ran).toHaveProperty("error")
            expect(flow_ran).toHaveProperty("ok")
            expect(flow_ran.ok).toBe(false)
            expect(flow_ran.error).toBeInstanceOf(Error)
            expect(flow_ran.error).toHaveProperty("stack")
            expect(flow_ran.error).toHaveProperty("message")
        })

        it("infraGkeJenkins should return a code of -1 when error occurs", async () => {
            Utils.prepBase = jest.fn().mockImplementationOnce(() => {
                throw new Error("Something weird happened")
            })
            const flow_ran: CliResponse = await mainWorker.infraGkeJenkins(
                mockAnswerSsr,
            )
            expect(Utils.prepBase).toHaveBeenCalled()
            expect(flow_ran).toHaveProperty("error")
            expect(flow_ran).toHaveProperty("ok")
            expect(flow_ran.ok).toBe(false)
            expect(flow_ran.error).toBeInstanceOf(Error)
            expect(flow_ran.error).toHaveProperty("stack")
            expect(flow_ran.error).toHaveProperty("message")
        })

        it("ssrGkeTfs should return a code of -1 when error occurs", async () => {
            Utils.prepBase = jest.fn().mockImplementationOnce(() => {
                throw new Error("Something weird happened")
            })
            const flow_ran: CliResponse = await mainWorker.ssrGkeTfs(
                mockAnswerSsrGke,
            )
            expect(Utils.prepBase).toHaveBeenCalled()
            expect(flow_ran).toHaveProperty("error")
            expect(flow_ran).toHaveProperty("ok")
            expect(flow_ran.ok).toBe(false)
            expect(flow_ran.error).toBeInstanceOf(Error)
            expect(flow_ran.error).toHaveProperty("stack")
            expect(flow_ran.error).toHaveProperty("message")
        })

        it("ssrGkeJenkins should return a code of -1 when error occurs", async () => {
            Utils.prepBase = jest.fn().mockImplementationOnce(() => {
                throw new Error("Something weird happened")
            })
            const flow_ran: CliResponse = await mainWorker.ssrGkeJenkins(
                mockAnswerSsrGke,
            )
            expect(Utils.prepBase).toHaveBeenCalled()
            expect(flow_ran).toHaveProperty("error")
            expect(flow_ran).toHaveProperty("ok")
            expect(flow_ran.ok).toBe(false)
            expect(flow_ran.error).toBeInstanceOf(Error)
            expect(flow_ran.error).toHaveProperty("stack")
            expect(flow_ran.error).toHaveProperty("message")
        })
    })
})
