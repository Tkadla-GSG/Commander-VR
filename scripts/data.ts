import { map, compose, uniq, get, find, filter } from 'lodash/fp';

const data = {
    Authorization: {
        AccessInfo: {
            Enterprises: [],
            Services: [],
        }
    },
    Resources: {
        Resources: [],
    },
    Reservations: {},
};

export const setAuthorizationData = auth => data.Authorization = auth;
export const setReservationData = reservations => data.Reservations = reservations;
export const setResourceData = resources => data.Resources = resources;

const getEnterprise = enterpriseId => find({Id: enterpriseId}, data.Authorization.AccessInfo.Enterprises) || {};

export const getEnterpriseVisitIds = enterpriseId => compose(
    map('Id'),
    id => filter({ EnterpriseId: id }, data.Authorization.AccessInfo.Services)
)(enterpriseId)

export const getFloorNames = () => compose(
    uniq,
    map('Data.Value.FloorNumber')
)( data.Resources.Resources)
