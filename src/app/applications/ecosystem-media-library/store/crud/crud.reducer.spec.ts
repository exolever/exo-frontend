import { PaginationModel } from '@applications/shared/models';

import { Resource, ResourceStatus, ResourceType } from '../resource.model';
import * as CrudReducers from './crud.reducer';
import * as CrudActions from './crud.actions';
import { reducer } from './crud.reducer';



describe('SearchReducer', () => {
  const resource1 = new Resource(
    { pk: '1', name: 'name1', type: ResourceType.Video, tags: [], status: ResourceStatus.Available }
    );
  const resoruce2 = new Resource(
    { pk: '2', name: 'name2', type: ResourceType.Video, tags: [], status: ResourceStatus.Available }
  );

  const initialState: CrudReducers.CrudState = {
    resources: [],
    resourcesCount: 0
  };

  describe('undefined action', () => {
    it('should return the default state', () => {
      const result = reducer(initialState, {} as any);
      expect(JSON.stringify(result)).toBe(JSON.stringify(initialState));
    });
  });

  describe('UPLOAD action', () => {
    it('should not modify the state', () => {
      const result = reducer(initialState, new CrudActions.Upload({}));

      expect(JSON.stringify(result)).toBe(JSON.stringify(initialState));
    });
  });

  describe('UPLOAD_SUCCESS action', () => {
    it('should return the state with the uploaded resource', () => {
      const result = reducer(initialState, new CrudActions.UploadSuccess(resource1));

      expect(result.resourcesCount).toBe(initialState.resourcesCount + 1);
      expect(result.resources.includes(resource1)).toBeTruthy();
    });
  });

  describe('UPLOAD_ERROR action', () => {
    it('should not modify the state', () => {
      const result = reducer(initialState, new CrudActions.UploadError());

      expect(JSON.stringify(result)).toBe(JSON.stringify(initialState));
    });
  });

  describe('UPDATE action', () => {
    it('should not modify the state', () => {
      const result = reducer(initialState, new CrudActions.Update({}));

      expect(JSON.stringify(result)).toBe(JSON.stringify(initialState));
    });
  });

  describe('UPDATE_SUCCESS action', () => {
    it('should return the state with the updated resource', () => {
      initialState.resources.push(resource1);
      initialState.resourcesCount = initialState.resourcesCount + 1;

      resource1.name = 'New name';

      const result = reducer(initialState, new CrudActions.UpdateSuccess(resource1));

      expect(result.resourcesCount).toBe(initialState.resourcesCount);
      expect(result.resources.includes(resource1)).toBeTruthy();
    });
  });

  describe('UPDATE_ERROR action', () => {
    it('should not modify the state', () => {
      const result = reducer(initialState, new CrudActions.UpdateError());

      expect(JSON.stringify(result)).toBe(JSON.stringify(initialState));
    });
  });

  describe('DELETE action', () => {
    it('should not modify the state', () => {
      const result = reducer(initialState, new CrudActions.Delete(resource1));

      expect(JSON.stringify(result)).toBe(JSON.stringify(initialState));
    });
  });

  describe('DELETE_SUCCESS action', () => {
    it('should return the state with the updated resource', () => {
      initialState.resources.push(resource1);
      initialState.resourcesCount = initialState.resourcesCount + 1;

      const result = reducer(initialState, new CrudActions.DeleteSuccess(resource1));

      expect(result.resourcesCount).toBe(initialState.resourcesCount - 1 );
      expect(result.resources.includes(resource1)).toBeFalsy();
    });
  });

  describe('DELETE_ERROR action', () => {
    it('should not modify the state', () => {
      const result = reducer(initialState, new CrudActions.DeleteError());

      expect(JSON.stringify(result)).toBe(JSON.stringify(initialState));
    });
  });

  describe('LOAD_RESOURCES action', () => {
    it('should set the state with the resources information', () => {
      const data = new PaginationModel(2, undefined, undefined, [resource1, resoruce2]);
      const result = reducer(initialState, new CrudActions.LoadResources(data));

      expect(result.resourcesCount).toBe(2);
      expect(result.resources.includes(resource1)).toBeTruthy();
      expect(result.resources.includes(resoruce2)).toBeTruthy();
    });
  });
});
