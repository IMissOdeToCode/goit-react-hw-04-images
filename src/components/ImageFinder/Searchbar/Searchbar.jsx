import { useState } from 'react';
import { ImSearch } from 'react-icons/im';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';

import searchInitialState from './searchInitialState';

import css from './Searchbar.module.css';

const Searchbar = ({ onSubmit }) => {
  const [state, setState] = useState(() => {
    return { ...searchInitialState };
  });

  const handleChange = ({ target }) => {
    const { name, value } = target;
    setState(prevState => {
      return { ...prevState, [name]: value };
    });
  };

  const handleSubmit = event => {
    event.preventDefault();
    if (query.trim() === '') {
      return toast.warn('🦄 empty search field!');
    }

    onSubmit({ ...state });
    reset();
  };

  const reset = () => {
    setState({ ...searchInitialState });
  };

  const { query } = state;

  return (
    <header className={css.Searchbar}>
      <form onSubmit={handleSubmit} className={css.SearchForm}>
        <button type="submit" className={css.SearchFormButton}>
          <ImSearch style={{ margiRight: 0 }} />
          <span className={css.SearchFormButtonLabel}>Search</span>
        </button>

        <input
          onChange={handleChange}
          value={query}
          className={css.SearchFormInput}
          name="query"
          type="text"
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
        />
      </form>
    </header>
  );
};

export default Searchbar;

Searchbar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
