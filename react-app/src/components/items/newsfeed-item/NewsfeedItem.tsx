import { Icon, IconButton } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Newsfeed } from '../../../models/newsfeed.model';
import { User } from '../../../models/user.model';
import { hasRight } from '../../../utils/auth-utils';
import styles from './NewsfeedItem.module.css';

type NewsfeedItemProps = {
  newsfeed: Newsfeed,
  user?: User,
}

type NewsfeedItemState = {
  canAccess: boolean;
}

export const NewsfeedItem: FC<NewsfeedItemProps> = ({ newsfeed, user }) => {
  const [state, setState] = useState<NewsfeedItemState>({ canAccess: false });
  const navigate = useNavigate();

  const editNewsfeed = () => {
    navigate(`/admin/newsfeed/${newsfeed.id}`);
  }

  useEffect(() => {
    const tempState: NewsfeedItemState = {} as NewsfeedItemState;
    tempState.canAccess = hasRight(["siteManager", "admin"], user);
    setState(tempState);
  }, [user]);

  return (
    <div className={styles["newsfeed-item"]}>
      <div className={styles["edit-button"]}>
        {state.canAccess &&
        <IconButton onClick={editNewsfeed}>
          <Icon fontSize='small' className={styles["edit-icon"]}>build</Icon>
        </IconButton>}
      </div>
      <div className={styles["newsfeed-header"]}>
        <div className={styles["header-title"]}>
          <label className={styles["title"]}>{newsfeed.title}</label>
          <label className={styles["modification"]}>{newsfeed.modification.split("T")[0]}</label>
        </div>
        <div className={styles["header-subtitle"]}>
          <label className={styles["series-name"]}>{newsfeed.series.title}</label>
        </div>
      </div>
      <div className={styles["newsfeed-body"]}>
        <label>
          {newsfeed.description}
        </label>
      </div>
    </div>
  )
}