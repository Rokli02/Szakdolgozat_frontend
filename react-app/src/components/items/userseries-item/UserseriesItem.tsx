import { Icon, IconButton } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserSeries } from '../../../models/series.model';
import { User } from '../../../models/user.model';
import { hasRight } from '../../../utils/auth-utils';
import { getDefaultImageUrl, getImageUrlRequest } from '../../../utils/image-utils';
import { getCategories, getLimitColor } from '../../../utils/series-utils';
import styles from './UserseriesItem.module.css';

type UserSeriesItemProps = {
  userseries: UserSeries,
  user?: User,
}

type UserSeriesItemState = {
  canEdit: boolean;
}

export const UserseriesItem: FC<UserSeriesItemProps> = ({ userseries, user }) => {
  const [categories] = useState<string>(getCategories(userseries.series));
  const [state, setState] = useState<UserSeriesItemState>({ canEdit: false });
  const [image, setImage] = useState<{ url: string, isDefault: boolean}>({ url: "", isDefault: true });
  const navigate = useNavigate();

  const editSeries = () => {
    navigate(`/user/handle/series/${userseries.series.id}`);
  }

  useEffect(() => {
    if(userseries.series.image?.name) {
      getImageUrlRequest(userseries.series.image?.name)
        .then((url) => {
          setImage({ url: url, isDefault: false});          
        })
        .catch((url) => {
          setImage({ url: url, isDefault: true});
        });
    } else {
      setImage({ url: getDefaultImageUrl(), isDefault: true});
    }
  }, [userseries]);

  useEffect(() => {
    const tempState: UserSeriesItemState = {} as UserSeriesItemState;
    tempState.canEdit = hasRight(["user"], user);
    setState(tempState);
  }, [user]);

  return (
    <div className={`${styles["series-item"]} ${image.isDefault ? styles["defaultImage"] : ""}`}
        style={{
          backgroundImage: `url(${image.url})`,
          backgroundPosition: `top ${userseries.series.image?.y_offset} left ${userseries.series.image?.x_offset}`
        }}
    >
        <div className={styles["float-button"]}>
          {state.canEdit &&
            <IconButton onClick={editSeries}>
            <Icon fontSize='small' className={styles["float-icon"]}>build</Icon>
          </IconButton>}
        </div>
      <header>
        <label className={styles["series-name"]}>{userseries.series.title}</label>
      </header>
      <div className={styles['series-item-body']}>
        <div className={styles["seasons"]}>{userseries.season}. évad, {userseries.episode}. rész</div>
        <div className={styles["series-prodyear"]}>{userseries.series.prodYear}</div>
        <div className={styles["series-length"]}>{userseries.series.length} perc</div>
        <div className={styles["series-category"]}>{categories}</div>
      </div>
      <footer>
        <label className={styles["age-limit"]} style={{ borderColor: getLimitColor(userseries.series.ageLimit)}}>{userseries.series.ageLimit}</label>
        <div className={styles["status"]}>
          <label>{userseries.status.name}</label>
        </div>
      </footer>
    </div>
  )
}