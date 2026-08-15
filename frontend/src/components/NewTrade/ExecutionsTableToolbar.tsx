import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton, Toolbar, Tooltip, Typography } from '@mui/material';

import * as styles from '@/styles/flex';

interface ExecutionsTableToolbarProps {
  selected: number[];
  addExecution: () => void;
  handleDelete: () => void;
}

export default function ExecutionsTableToolbar({ selected, addExecution, handleDelete }: ExecutionsTableToolbarProps) {
  return (
    <Toolbar sx={{ ...(selected.length > 0 && { bgcolor: (theme) => theme.palette.action.selected }) }}>
      {selected.length > 0 ? (
        <Typography sx={styles.flexPercent(100)} color='inherit' variant='subtitle1' component='div'>
          {selected.length} selected
        </Typography>
      ) : (
        <>
          <Typography sx={styles.flexPercent(100)} variant='h6' id='tableTitle' component='div'>
            Executions
          </Typography>

          <Tooltip title='Add new execution'>
            <IconButton color='primary' onClick={addExecution}>
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
