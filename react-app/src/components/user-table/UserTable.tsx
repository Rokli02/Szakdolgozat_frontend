import { Paper, Table, TableCell, TableContainer, TableHead, TableRow, TableBody, Icon, TablePagination } from '@mui/material';
import { AxiosError } from 'axios';
import { FC, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SnackbarContext } from '../../contexts/snackbarContext';
import { UserPageModel } from '../../models/user.model';
import { getUsersRequest } from '../../utils/user-utils';
import styles from './UserTable.module.css';

type UserTableProps = {
  searchValue: string;
  setSelectedUserId: (userId: number) => void,
  refreshToken?: boolean;
}

type OrderStateType = {
  order?: string;
  direction: boolean;
}

type PaginationOptionsType = {
  currentPageSize: number;
  currentPage: number;
}

export const UserTable: FC<UserTableProps> = ({ searchValue, setSelectedUserId, refreshToken }) => {
  const [activeOrder, setActiveOrder] = useState<OrderStateType>({ direction: false });
  const [users, setUsers] = useState<UserPageModel>({ users: [], count: -1 });
  const [paginationOptions, setPaginationOptions] = useState<PaginationOptionsType>({ currentPageSize: 10, currentPage: 0 });
  const { setMessage } = useContext(SnackbarContext);
  const navigate = useNavigate();

  const selectOrder = (name?: string) => {
    if(activeOrder.order === name) {
      setActiveOrder((pre) => ({
        ...pre,
        direction: !pre.direction,
      }));
    } else {
      setActiveOrder({
        order: name,
        direction: false,
      })
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await getUsersRequest(paginationOptions.currentPage + 1, paginationOptions.currentPageSize, searchValue, activeOrder.order, activeOrder.direction);
      if(response) {
        setUsers(response);
      }
    } catch(err) {
      if((err as AxiosError<any>).response.status === 401) {
        navigate("/logout");
      }
      setMessage((err as AxiosError<any>).response.data.message)
    }
  }

  const handlePageNumberChange = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, page: number) => {
    setPaginationOptions((pre) => ({
      ...pre,
      currentPage: page,
    }))
  }

  const handlePageSizeChange = (e: any) => {
    setPaginationOptions((pre) => ({
      currentPage: 0,
      currentPageSize: e.target.value,
    }))
  }

  useEffect(() => {
    fetchUsers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue, activeOrder, paginationOptions, refreshToken]);

  return (
    <TableContainer className={styles["table"]} component={Paper}>
    <Table>
      <TableHead>
        <TableRow className={styles["mat-header-row"]}>
          {
            userTableHeaders.map((header) => (
              <TableCell className={`${styles["mat-header-cell"]} ${header.value === "created" && styles["hide-created"]} ${header.value === "email" && styles["hide-email"]}`} key={header.id}>
                {
                  header.canChangeOrder
                  ?
                  <div className={`${styles["header"]} ${activeOrder.order === header.value ? styles["active"] : ""} ${activeOrder.direction ? styles["asc"] : ""}`} 
                      onClick={() => selectOrder(header.value)}
                  >
                    {header.shownValue}
                    <Icon className={styles["icon"]}>expand_more</Icon>
                  </div>
                  :
                  <span>
                    {header.shownValue}
                  </span>
                }
                
              </TableCell>
            ))
          }
        </TableRow>
      </TableHead>
      <TableBody>
        {users.users.map((user) => (
          <TableRow key={user.id} className={styles["mat-row"]} onClick={() => setSelectedUserId(user.id)}
          >
            <TableCell className={styles["mat-cell"]}><span>{user.id}</span></TableCell>
            <TableCell className={styles["mat-cell"]}><span>{user.name}</span></TableCell>
            <TableCell className={`${styles["mat-cell"]} ${styles["hide-email"]}`}><span>{user.email}</span></TableCell>
            <TableCell className={styles["mat-cell"]}><span>{user.birthdate.split("T")[0]}</span></TableCell>
            <TableCell className={styles["mat-cell"]}><span>{user.role.name}</span></TableCell>
            <TableCell className={styles["mat-cell"]}><span>{String(user.active)}</span></TableCell>
            <TableCell className={`${styles["mat-cell"]} ${styles["hide-created"]}`}><span>{user.created.split("T")[0]}</span></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    <TablePagination className={styles["paginator"]}
        rowsPerPageOptions={[10, 25]}
        rowsPerPage={paginationOptions.currentPageSize}
        component="div"
        count={users.count}
        page={paginationOptions.currentPage}
        onPageChange={handlePageNumberChange}
        onRowsPerPageChange={handlePageSizeChange}
    />
  </TableContainer>
  )
}

const userTableHeaders = [
  {
    id: 0,
    shownValue: "ID",
    value: undefined,
    canChangeOrder: true,
  },
  {
    id: 1,
    shownValue: "Név",
    value: "name",
    canChangeOrder: true,
  },
  {
    id: 2,
    shownValue: "Email",
    value: "email",
    canChangeOrder: true,
  },
  {
    id: 3,
    shownValue: "Születésnap",
    value: "birthdate",
    canChangeOrder: true,
  },
  {
    id: 4,
    shownValue: "Szerepkör",
    value: "role",
    canChangeOrder: false,
  },
  {
    id: 5,
    shownValue: "Aktív",
    value: "active",
    canChangeOrder: false,
  },
  {
    id: 6,
    shownValue: "Fiók létrehozás",
    value: "created",
    canChangeOrder: true,
  },
]