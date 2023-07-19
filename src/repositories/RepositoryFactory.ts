import ReportRepositories from "@/repositories/ReportRepositories";

const repositories: any = {
    'report': ReportRepositories
}

export default{
    //ts-ignore
    get: (name: any) => repositories[name]
}
