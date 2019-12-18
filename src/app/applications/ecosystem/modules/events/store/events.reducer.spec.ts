import * as MomentTZ from 'moment-timezone';
import * as fromEvent from './events.reducer';
import * as fromActions from './events.action';
import { Event } from './event.model';
import { AppState } from '@core/store/reducers';


describe('EventReducer', () => {
  let initialState: fromEvent.EventState;
  beforeEach(() => {
    initialState = {
      loading: false,
      selectedEventPk: undefined,
      entities: {},
      ids: [],
      selectedAttendeePk: undefined,
      pageIndex: undefined,
      pageSize: undefined,
      count: undefined,
      participants: undefined

    };
  });

  it('should return the default state', () => {
    const action = <fromActions.WorkshopActions>{};
    const state = fromEvent.reducer(undefined, action);

    expect(state).toEqual(initialState);
  });

  it('LOAD_EVENTS works', () => {
    const action = new fromActions.LoadEvents({pageIndex: 0, pageSize: 15});
    const finalState = fromEvent.reducer(initialState, action);
    const expectedState = <fromEvent.EventState>{
      count: undefined,
      entities: {},
      ids: [],
      loading: true,
      pageIndex: 0,
      pageSize: 15,
      participants: undefined,
      selectedAttendeePk: undefined,
      selectedEventPk: undefined
    };
    console.log(finalState);
    expect(finalState).toEqual(expectedState);
  });

  it('isLoading selector works', () => {
    const result = fromEvent.isLoading(<AppState>{events: initialState});
    expect(result).toBe(false);
  });

  it('loadedWithoutContent is false while is loading (with data)', () => {
    initialState.loading = true;
    initialState.entities = {'1': <Event>{}};
    const result = fromEvent.loadedWithoutContent(<AppState>{events: initialState});
    expect(result).toBe(false);
  });

  it('loadedWithoutContent is false while is loading (without data)', () => {
    initialState.loading = true;
    initialState.entities = undefined;
    const result = fromEvent.loadedWithoutContent(<AppState>{events: initialState});
    expect(result).toBe(false);
  });

  it('loadedWithoutContent is false after load with data', () => {
    initialState.loading = false;
    initialState.entities = {'1': <Event>{}};
    const result = fromEvent.loadedWithoutContent(<AppState>{events: initialState});
    expect(result).toBe(false);
  });

  it('loadedWithoutContent is true after load without data', () => {
    initialState.loading = false;
    initialState.entities = {};
    const result = fromEvent.loadedWithoutContent(<AppState>{events: initialState});
    expect(result).toBe(true);
  });

  it('getAll selector works', () => {
    const workshopInstance = new Event({pk: '1', name: '', start: MomentTZ()});
    initialState.ids = [workshopInstance.pk];
    initialState.entities = { '1': workshopInstance};

    const result = fromEvent.getAll(<AppState>{events: initialState});
    expect(result).toEqual([workshopInstance]);
  });
});
