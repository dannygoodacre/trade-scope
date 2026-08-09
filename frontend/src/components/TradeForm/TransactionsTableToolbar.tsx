import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton, Toolbar, Tooltip, Typography } from '@mui/material';

import * as commonStyles from '@/styles';

interface TransactionsTableToolbarProps {
  selected: number[];
  addTransaction: () => void;
  handleDelete: () => void;
}

export default function TransactionsTableToolbar({
  selected,
  addTransaction,
  handleDelete
}: TransactionsTableToolbarProps) {
  return (
    <Toolbar sx={{ ...(selected.length > 0 && { bgcolor: theme => theme.palette.action.selected }) }}>
      {selected.length > 0 ? (
        <Typography sx={commonStyles.flexPercent(100)} color='inherit' variant='subtitle1' component='div'>
          {selected.length} selected
        </Typography>
      ) : (
        <>
          <Typography sx={commonStyles.flexPercent(100)} variant='h6' id='tableTitle' component='div'>
            Transactions
          </Typography>
          <Tooltip title='Add new transaction'>
            <IconButton color='primary' onClick={addTransaction}>
              <AddIcon />
            </IconButton>
          </Tooltip>
        </>
      )}

      {selected.length > 0 && (
        <Tooltip title='Delete'>
          <IconButton onClick={handleDelete}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}
