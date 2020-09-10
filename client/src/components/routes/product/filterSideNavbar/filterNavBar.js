import React, { useEffect, useState } from 'react';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import history from '../../../../history';
import ApparelCheckBox from './apparelCheckBox';
import GenderRadioButton from './genderRadioButton';
import BrandCheckBox from './brandCheckBox';
import PriceCheckBox from './priceCheckBox';
import ClearAllButton from './clearAllButton';
import { connect, useDispatch, useSelector } from 'react-redux';
import { loadFilterAttributes } from '../../../../actions';
import { Grid } from '@material-ui/core';
import { useFilterNavBarStyles } from '../../../../styles/materialUI/filterNavBarStyles';
import {
  FILTER_ATTRIBUTES,
  MAX_PRODUCTS_PER_PAGE,
  PAGE_ATTRIBUTE,
  SORT_ATTRIBUTE,
} from '../../../../constants/constants';
import {
  ADD_SELECTED_CATEGORY,
  LOAD_SELECTED_CATEGORY_FROM_URL,
  SAVE_QUERY_STATUS,
  SAVE_SORT_LIST,
  SELECT_PRODUCT_PAGE,
  SELECT_SORT_CATEGORY,
} from '../../../../actions/types';
import { PRODUCTS_ROUTE } from '../../../../constants/react_routes';

function FilterNavBar(props) {
  const classes = useFilterNavBarStyles();
  const selectedGenders = useSelector(
    (state) => state.selectedFilterAttributesReducer.genders,
  );
  const selectedApparels = useSelector(
    (state) => state.selectedFilterAttributesReducer.apparels,
  );
  const selectedBrands = useSelector(
    (state) => state.selectedFilterAttributesReducer.brands,
  );
  const selectedPriceRanges = useSelector(
    (state) => state.selectedFilterAttributesReducer.prices,
  );
  const selectedFilterAttributes = useSelector(
    (state) => state.selectedFilterAttributesReducer,
  );
  const selectedSort = useSelector((state) => state.selectSortReducer);
  const selectedPage = useSelector((state) => state.selectPageReducer);
  const dispatch = useDispatch();
  const [loadOnlyProducts, setLoadOnlyProducts] = useState(false);

  /**
   * multiple selected options IDs are appended
   * which will work like OR condition
   *
   * @param attrList
   * @returns {string|null}
   */
  const appendQueryIds = (attrList) => {
    let selectedList = [];

    if (attrList.length > 0) {
      attrList.forEach(({ id }) => {
        selectedList.push(id);
      });
      return selectedList.join();
    }
    return null;
  };

  const prepareQuery = () => {
    let query = [];
    let executeDefaultQuery = true;

    if (selectedGenders.length > 0) {
      executeDefaultQuery = false;
      query.push(`genders=${selectedGenders[0].id}`);
    }

    let idList = appendQueryIds(selectedApparels);
    if (idList) {
      executeDefaultQuery = false;
      query.push(`apparels=${appendQueryIds(selectedApparels)}`);
    }

    idList = appendQueryIds(selectedBrands);
    if (idList) {
      executeDefaultQuery = false;
      query.push(`brands=${appendQueryIds(selectedBrands)}`);
    }

    idList = appendQueryIds(selectedPriceRanges);
    if (idList) {
      query.push(`prices=${appendQueryIds(selectedPriceRanges)}`);
    }

    if (selectedSort.id > 1) {
      query.push(`sortby=${selectedSort.id}`);
    }

    if (selectedPage) {
      query.push(
        `page=${
          (selectedPage.pageNumber - 1) * MAX_PRODUCTS_PER_PAGE
        },${MAX_PRODUCTS_PER_PAGE}`,
      );
    }

    if (executeDefaultQuery) {
      query.push('category=all');
    }

    if (query.length > 0) {
      query = query.join('::');
      return `?q=${query}`;
    }
    return null;
  };

  const getObjectFromList = (id, list) => {
    for (let i = 0; i < list.length; i++) {
      try {
        if (list[i].id === parseInt(id)) return list[i];
      } catch (e) {
        return null;
      }
    }
    return null;
  };

  const dispatchFilterAttributesFromURL = (filterAPIData, queryFromURL) => {
    if (
      history.location &&
      history.location.pathname.localeCompare(PRODUCTS_ROUTE) === 0
    ) {
      let selectedFilterAttributes = {};

      FILTER_ATTRIBUTES.forEach((attribute) => {
        let queryParameters = queryFromURL.split(`${attribute}=`);

        if (queryParameters.length > 1) {
          for (let pIndex = 1; pIndex < queryParameters.length; ++pIndex) {
            let values;
            try {
              values = queryParameters[pIndex].split('::')[0].split(',');
            } catch (e) {}

            let selectedAttrList = [];
            if (values.length > 0) {
              values.forEach((id) => {
                let attrObject = getObjectFromList(
                  id,
                  filterAPIData[attribute],
                );
                if (attrObject) {
                  // if found then push object to list
                  selectedAttrList.push({
                    id: attrObject.id,
                    value: attrObject.value,
                  });
                }
              });
              if (selectedAttrList.length > 0) {
                selectedFilterAttributes = {
                  ...selectedFilterAttributes,
                  [attribute]: {
                    attrList: selectedAttrList,
                  },
                };
              }
            }
          }
        }
      });

      selectedFilterAttributes = {
        ...selectedFilterAttributes,
        oldQuery: queryFromURL,
        newQuery: queryFromURL,
      };

      dispatch({
        type: LOAD_SELECTED_CATEGORY_FROM_URL,
        payload: selectedFilterAttributes,
      });
    }
  };

  const dispatchSortAttributeFromURL = (filterAPIData, queryFromURL) => {
    let queryParameters = queryFromURL.split(`${SORT_ATTRIBUTE}=`);
    if (queryParameters.length > 1) {
      let id = queryParameters[1][0];
      let attrObject = getObjectFromList(id, filterAPIData[SORT_ATTRIBUTE]);
      if (attrObject) {
        dispatch({
          type: SELECT_SORT_CATEGORY,
          payload: {
            id: attrObject.id,
            value: attrObject.type,
            isLoadedFromURL: true,
          },
        });
      }
    }
  };

  const dispatchPageAttributeFromURL = (filterAPIData, queryFromURL) => {
    let queryParameters = queryFromURL.split(`${PAGE_ATTRIBUTE}=`);
    if (queryParameters.length > 1) {
      let id = queryParameters[1].split(',');
      if (id.length > 1) {
        try {
          let pageNo = parseInt(id[0]);
          dispatch({
            type: SELECT_PRODUCT_PAGE,
            payload: {
              pageNumber: pageNo > 0 ? pageNo / MAX_PRODUCTS_PER_PAGE + 1 : 1,
              maxProducts: MAX_PRODUCTS_PER_PAGE,
              isLoadedFromURL: true,
            },
          });
        } catch (e) {}
      }
    }
  };

  const sortByObjValues = (list) => {
    let cloneList = JSON.parse(JSON.stringify(list));

    return cloneList.sort((a, b) =>
      a.value.charAt(0).toUpperCase() > b.value.charAt(0).toUpperCase()
        ? 1
        : -1,
    );
  };

  const dispatchSortList = (filterAttr) => {
    let sortListPayload = {};
    sortListPayload.apparels = sortByObjValues(filterAttr.apparels);
    sortListPayload.brands = sortByObjValues(filterAttr.brands);

    dispatch({
      type: SAVE_SORT_LIST,
      payload: sortListPayload,
    });
  };

  useEffect(() => {
    const { oldQuery, newQuery } = selectedFilterAttributes;

    if (!oldQuery || (oldQuery && oldQuery.localeCompare(newQuery) === 0)) {
      return;
    }

    let queryFromURL = history.location.search;
    if (!newQuery) {
      let queryPreparedFromFilters = prepareQuery();

      props.loadFilterAttributes(queryPreparedFromFilters).then((data) => {
        if (!data) {
          return;
        }

        dispatchSortList(data);
        dispatch({
          type: ADD_SELECTED_CATEGORY,
          payload: { newQuery: queryPreparedFromFilters },
        });

        if (selectedPage.pageNumber > 1) {
          dispatch({
            type: SELECT_PRODUCT_PAGE,
            payload: {
              pageNumber: 1,
              maxProducts: MAX_PRODUCTS_PER_PAGE,
              isLoadedFromURL: false,
            },
          });
        } else {
          dispatch({
            type: SAVE_QUERY_STATUS,
            payload: queryPreparedFromFilters,
          });
        }
      });
    }
  }, [selectedFilterAttributes]);

  useEffect(() => {
    const { oldQuery, newQuery } = selectedFilterAttributes;

    let queryFromURL = history.location.search;

    if (loadOnlyProducts) {
      setLoadOnlyProducts(false);
      return;
    }

    if (!oldQuery || newQuery.localeCompare(queryFromURL) !== 0) {
      props.loadFilterAttributes(queryFromURL).then((data) => {
        if (!data) {
          return;
        }

        dispatchFilterAttributesFromURL(data, queryFromURL);
        dispatchSortAttributeFromURL(data, queryFromURL);
        dispatchPageAttributeFromURL(data, queryFromURL);
        dispatchSortList(data);
        dispatch({
          type: SAVE_QUERY_STATUS,
          payload: queryFromURL,
        });
      });
    }
  }, [props]);

  useEffect(() => {
    if (!selectedPage.isLoadedFromURL || !selectedSort.isLoadedFromURL) {
      let query = prepareQuery();

      if (query) {
        setLoadOnlyProducts(true);

        dispatch({
          type: SAVE_QUERY_STATUS,
          payload: query,
        });
      }
    }
  }, [selectedPage, selectedSort]);

  if (
    !selectedFilterAttributes.newQuery &&
    selectedFilterAttributes.newQuery === selectedFilterAttributes.oldQuery
  ) {
    return null;
  }

  const renderDrawerComponents = (component) => {
    return (
      <>
        <Grid container direction="column" style={{ paddingLeft: '1.5rem' }}>
          {component}
        </Grid>

        <div style={{ paddingTop: '0.5rem' }}>
          <Divider />
        </div>
      </>
    );
  };

  const drawer = (
    <>
      <Grid
        container
        alignItems="center"
        style={{
          position: 'sticky',
          top: 0,
          backgroundColor: 'white',
          fontWeight: 'bold',
          fontSize: '1.2rem',
          zIndex: 1040,
          paddingTop: '1rem',
        }}
      >
        <Grid item sm={6} style={{ paddingLeft: '1.5rem' }}>
          FILTERS
        </Grid>
        <Grid item sm={6} style={{ paddingLeft: '3rem' }}>
          <ClearAllButton />
        </Grid>
        <Grid item style={{ height: '1px', width: '100%', paddingTop: '1rem' }}>
          <Divider />
        </Grid>
      </Grid>

      {renderDrawerComponents(<GenderRadioButton />)}
      {renderDrawerComponents(<ApparelCheckBox />)}
      {renderDrawerComponents(<BrandCheckBox />)}
      {renderDrawerComponents(<PriceCheckBox />)}
    </>
  );

  return (
    <div className={classes.root}>
      <nav className={classes.drawer}>
        <Hidden smDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
    </div>
  );
}

export default connect(null, { loadFilterAttributes })(FilterNavBar);
