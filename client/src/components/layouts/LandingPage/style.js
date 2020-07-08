import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  text: {
    width: '70%',
    fontFamily: 'Quicksand',
    fontSize: '15px',
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      fontSize: '20px',
    },
  },
  description: {
    marginLeft: '-35px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: '15px',
    [theme.breakpoints.up(950 + theme.spacing(2) * 2)]: {
      marginBottom: 'none',
      marginTop: '-40px',
    },
  },
  link: {
    color: '#90B27A',
  },
  landing: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',

    [theme.breakpoints.up(950 + theme.spacing(2) * 2)]: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
  },
  button: {
    marginTop: '20px',
    marginLeft: '-50px',
    [theme.breakpoints.up(950 + theme.spacing(2) * 2)]: {
      marginLeft: '-280px',
      marginTop: '30px',
    },
  },
  footer: {
    width: '100%',
  },
  image: {
    width: '60%',
    marginTop: '10px',
    marginBottom: '20px',
    [theme.breakpoints.up(950 + theme.spacing(2) * 2)]: {
      marginRight: '20px',
      width: '40%',
    },
  },
}));

export default useStyles;
