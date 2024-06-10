import { systemRoles } from "../../utils/systemRoles.js";


export const endPointsRoles = {
    ACCESS_COMPANY : [systemRoles.COMPANYHR],
    GET_COMPANY_BY_NAME : [systemRoles.COMPANYHR, systemRoles.USER],

}