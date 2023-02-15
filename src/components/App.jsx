import { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Searchbar from './ImageFinder/Searchbar/Searchbar';
import ImageGallery from './ImageFinder/ImageGallery/ImageGallery';
import Button from './ImageFinder/Button/Button';
import Loader from './ImageFinder/Loader/Loader';
import Modal from './ImageFinder/Modal/Modal';
import DetailedImage from './ImageFinder/Modal/DetailedImage';

import searchImages from './ImageFinder/utils/pixabay-api';

import {
  STATUS_IDLE,
  STATUS_PENDING,
  STATUS_REJECTED,
  STATUS_RESOLVED,
  STATUS_EMPTY,
  PER_PAGE,
} from './ImageFinder/utils/constants';

const App = () => {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [images, setImages] = useState([]);
  const [isLoadMore, setIsLoadMore] = useState(false);

  const [error, setError] = useState(null);
  const [status, setStatus] = useState(STATUS_IDLE);

  const [isModalShow, setIsModalShow] = useState(false);
  const [detailedImageURL, setDetailedImageURL] = useState(null);

  useEffect(() => {
    if (!query) {
      return;
    }

    searchImages(query, page)
      .then(data => {
        if (data.hits.length === 0) {
          setStatus(STATUS_EMPTY);
          setError(() => {
            return new Error(`${query}`);
          });

          return;
        }

        const canLoadMore = Boolean(
          Math.ceil(page < data.totalHits / PER_PAGE)
        );
        setImages(prevImages => [...prevImages, ...data.hits]);
        setStatus(STATUS_RESOLVED);
        setIsLoadMore(canLoadMore);
      })
      .catch(err => {
        if (err.response.status === 404) {
          console.log('Resource could not be found!');
        } else {
          setError(err);
          setStatus(STATUS_REJECTED);
        }
      })
      .finally();
  }, [query, page]);

  const handleFormSubmit = ({ query }) => {
    setQuery(query);
    setPage(1);
    setImages([]);
  };

  const showLargeImage = largeImageURL => {
    setDetailedImageURL(largeImageURL);
    setIsModalShow(true);
  };

  const closeModal = () => {
    setDetailedImageURL(null);
    setIsModalShow(false);
  };

  const handleNextPage = () => {
    setPage(prevPage => prevPage + 1);
  };

  return (
    <>
      <Searchbar onSubmit={handleFormSubmit} />

      {status === STATUS_PENDING && <Loader />}

      {status === STATUS_EMPTY && (
        <p>
          There is no <strong>{error.message}</strong> images. Try searching cat
          images
        </p>
      )}

      {status === STATUS_REJECTED && <p>{error.message}</p>}

      {status === STATUS_RESOLVED && (
        <ImageGallery images={images} showLargeImage={showLargeImage} />
      )}

      {isLoadMore && <Button handleNextPage={handleNextPage} />}

      {isModalShow && (
        <Modal close={closeModal}>
          <DetailedImage largeImageURL={detailedImageURL} />
        </Modal>
      )}

      <ToastContainer />
    </>
  );
};

// class OldApp extends Component {
//   state = initialState;

//   componentDidUpdate(prevProps, prevState) {
//     const { query, page } = this.state;
//     const prevQuery = prevState.query;
//     const prevPage = prevState.page;

//     const isQueryChanged = prevQuery !== query;
//     const isPageChanged = prevPage !== page;
//     const condition = isQueryChanged || isPageChanged;

//     if (condition) {
//       if (isQueryChanged) {
//         this.setState({ status: STATUS_PENDING });
//       }

//       searchImages(query, page)
//         .then(data => {
//           if (data.hits.length === 0) {
//             this.setState({
//               status: STATUS_EMPTY,
//               error: new Error(`${query}`),
//             });
//             return;
//           }

//           const canLoadMore = Boolean(
//             Math.ceil(page < data.totalHits / PER_PAGE)
//           );
//           this.setState(({ images }) => ({
//             images: [...images, ...data.hits],
//             status: STATUS_RESOLVED,
//             isLoadMore: canLoadMore,
//           }));
//         })
//         .catch(err => {
//           if (err.response.status === 404) {
//             console.log('Resource could not be found!');
//           } else {
//             this.setState({ error: err, status: STATUS_REJECTED });
//           }
//         })
//         .finally();
//     }
//   }

//   handleNextPage = () => {
//     this.setState(({ page }) => ({ page: page + 1 }));
//   };

//   showLargeImage = largeImageURL => {
//     this.setState({ detailedImageURL: largeImageURL, isModalShow: true });
//   };

//   closeModal = () => {
//     this.setState({ isModalShow: false, detailedImageURL: null });
//   };

//   handleFormSubmit = ({ query }) => {
//     this.setState({
//       ...initialState,
//       query,
//     });
//   };

//   render() {
//     const { images, isModalShow, detailedImageURL, isLoadMore, status, error } =
//       this.state;
//     const { closeModal, showLargeImage, handleNextPage, handleFormSubmit } =
//       this;

//     return (
//       <>
//         <Searchbar onSubmit={handleFormSubmit} />

//         {status === STATUS_PENDING && <Loader />}

//         {status === STATUS_EMPTY && (
//           <p>
//             There is no <strong>{error.message}</strong> images. Try searching
//             cat images
//           </p>
//         )}

//         {status === STATUS_REJECTED && <p>{error.message}</p>}

//         {status === STATUS_RESOLVED && (
//           <ImageGallery images={images} showLargeImage={showLargeImage} />
//         )}

//         {isLoadMore && <Button handleNextPage={handleNextPage} />}

//         {isModalShow && (
//           <Modal close={closeModal}>
//             <DetailedImage largeImageURL={detailedImageURL} />
//           </Modal>
//         )}

//         <ToastContainer />
//       </>
//     );
//   }
// }

export default App;
