import { Icon, IconButton } from '@mui/material';
import { AxiosError } from 'axios';
import { FC, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../contexts/authContext';
import { SnackbarContext } from '../../../contexts/snackbarContext';
import { DropdownItem } from '../../../models/menu.model';
import { Series } from '../../../models/series.model';
import { User } from '../../../models/user.model';
import { hasRight } from '../../../utils/auth-utils';
import { getDefaultImageUrl, getImageUrlRequest } from '../../../utils/image-utils';
import { getCategories, getLimitColor, getSeasonOptions } from '../../../utils/series-utils';
import { defaultSaveUserSeriesRequest } from '../../../utils/userseries-utils';
import { DropdownBar } from '../drop-down-bar/DropdownBar';
import styles from './SeriesItem.module.css';

type SeriesItemProps = {
  series: Series,
  user?: User,
}

type SeriesItemState = {
  canAdd: boolean;
  canEdit: boolean;
}

export const SeriesItem: FC<SeriesItemProps> = ({ series, user }) => {
  const [options] = useState<DropdownItem[]>(getSeasonOptions(series));
  const [categories] = useState<string>(getCategories(series));
  const [state, setState] = useState<SeriesItemState>({ canAdd: false, canEdit: false });
  const [image, setImage] = useState<{ url: string, isDefault: boolean}>({ url: "", isDefault: true });
  const { setMessage } = useContext(SnackbarContext);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if(series.image?.name) {
      getImageUrlRequest(series.image?.name)
        .then((url) => {
          setImage({ url: url, isDefault: false});          
        })
        .catch((url) => {
          setImage({ url: url, isDefault: true});
        });
    } else {
      setImage({ url: getDefaultImageUrl(), isDefault: true});
    }
  }, [series]);

  useEffect(() => {
    const tempState: SeriesItemState = {} as SeriesItemState;
    tempState.canAdd = hasRight(["user"], user);
    tempState.canEdit = hasRight(["siteManager", "admin"], user);
    setState(tempState);
  }, [user]);

  const addSeries = async () => {
    try {
      if(series?.id) {
        await defaultSaveUserSeriesRequest(series?.id);
        setMessage("Sorozat sikeresen mentve!", "success");
      }
    } catch(err) {
      if((err as AxiosError).response?.status === 401) {
        logout();
      }
      setMessage((err as AxiosError<any>).response?.data.message);
    }
  }

  const editSeries = () => {
    navigate(`/admin/series/${series.id}`);
  }

  return (
    <div className={`${styles["series-item"]} ${image.isDefault ? styles["defaultImage"] : ""}`}
        style={{
          backgroundImage: `url(${image.url})`,
          backgroundPosition: `top ${series.image?.y_offset} left ${series.image?.x_offset}`
        }}
    >
      <div className={styles["float-button"]}>
        {state.canEdit && 
        <IconButton onClick={editSeries}>
          <Icon fontSize='small' className={styles["float-icon"]}>build</Icon>
        </IconButton>}
        { state.canAdd &&
        <IconButton className={styles["float-button"]} onClick={addSeries}>
          <Icon fontSize='small' className={styles["float-icon"]}>add</Icon>
        </IconButton>}
      </div>
      <header>
        <label className={styles["series-name"]}>{series.title}</label>
      </header>
      <div className={styles["series-item-body"]}>
        <div className={styles["series-prodyear"]}>{series.prodYear}</div>
        <div className={styles["series-length"]}>{series.length} perc</div>
        <div className={styles["series-category"]}>{categories}</div>
      </div>
      <footer>
        <label className={styles["age-limit"]} style={{ borderColor: getLimitColor(series.ageLimit)}}>{series.ageLimit}</label>
        <DropdownBar className={styles["season-drop-down"]} header="Évadok" width="100%" options={options}/>
      </footer>
    </div>
  );
}