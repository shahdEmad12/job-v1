import { systemRoles } from "../../utils/systemRoles.js";

export const endPointsRoles = {
    ACCESS_JOB : [systemRoles.COMPANYHR],
    BOTH_COMPANY : [systemRoles.COMPANYHR, systemRoles.USER],
    ACCESS_USER : [systemRoles.USER],
}