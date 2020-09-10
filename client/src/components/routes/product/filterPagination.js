import React from 'react';
import Grid from '@material-ui/core/Grid';
import { useDispatch, useSelector } from 'react-redux';
import { SELECT_PRODUCT_PAGE } from '../../../actions/types';
import Pagination from '@material-ui/lab/Pagination';
import { MAX_PRODUCTS_PER_PAGE } from '../../../constants/constants';

export default function FilterPagination() {
  const dispatch = useDispatch();
  const selectedPage = useSelector((state) => state.selectPageReducer);
  const filterProductsReducer = useSelector(
    (state) => state.filterProductsReducer,
  );
  let totalProducts = 0;

  const handleChangePage = (event, page) => {
    dispatch({
      type: SELECT_PRODUCT_PAGE,
      payload: {
        pageNumber: page,
        maxProducts: MAX_PRODUCTS_PER_PAGE,
        isLoadedFromURL: false,
      },
    });
  };

  // if we got data from the server side
  if (
    !filterProductsReducer ||
    filterProductsReducer.hasOwnProperty('data') === false ||
    filterProductsReducer.data.hasOwnProperty('totalCount') === false
  ) {
    return null;
  } else {
    totalProducts = filterProductsReducer.data.totalCount;
  }

  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      justify="center"
      style={{ padding: '30px 0 100px 0' }}
    >
      <Pagination
        onChange={handleChangePage}
        page={selectedPage.pageNumber}
        count={
          totalProducts <= MAX_PRODUCTS_PER_PAGE
            ? 1
            : Math.floor(totalProducts / MAX_PRODUCTS_PER_PAGE)
        }
        color="secondary"
      />
    </Grid>
  );
}
