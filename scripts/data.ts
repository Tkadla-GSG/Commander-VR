import { map, compose, get, uniq, sortBy, find, filter, keyBy } from 'lodash/fp';

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
export const setReservationData = reservationsResponse => data.Reservations = keyBy('Id', reservationsResponse.Reservations);
export const setResourceData = resources => data.Resources = resources;

const getEnterprise = enterpriseId => find({Id: enterpriseId}, data.Authorization.AccessInfo.Enterprises) || {};

export const getEnterpriseVisitIds = enterpriseId => compose(
    map('Id'),
    id => filter({ EnterpriseId: id }, data.Authorization.AccessInfo.Services)
)(enterpriseId)

export const getFloorNames = () => compose(
    uniq,
    map('Data.Value.FloorNumber')
)(data.Resources.Resources)

export const getArrivingReservationIds = () => compose(
    map('Id'),
    sortBy('StartUtc'),
    filter(({ ReservationTimeState }) => ReservationTimeState === 'ToBeCheckedIn' || ReservationTimeState === 'Future')
)(data.Reservations)

export const getDepartingReservationIds = () => compose(
    map('Id'),
    sortBy('EndUtc'),
    // TODO filter({ ReservationTimeState: 'Future' })
)(data.Reservations)

const getReservation = reservationId => get(reservationId, data.Reservations);

export const getReservationAdultCount = reservationId => get('AdultCount', getReservation(reservationId));
export const getReservationChildCount = reservationId => get('ChildCount', getReservation(reservationId));
