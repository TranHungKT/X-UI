import {
  Box,
  FormControlLabel,
  FormLabel,
  Link,
  Typography,
  Checkbox,
  Button,
  Grid2,
  Card,
  CardContent,
  FormControl,
  Modal,
} from '@mui/material';

import { useFormik } from 'formik';
import * as yup from 'yup';
import XIcon from '@mui/icons-material/X';
import BootstrapInput from '../../components/Input/BootstrapInput';
import { useMutation } from '@tanstack/react-query';
import { stsService } from '../../services/authServices';
import { DataFetchError } from '../../utils/dataFetch';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HOME_PATH } from '../../constants/routes';
import useAuthorization from '../../utils/hooks/useAuthorization';

const VALIDATION_SCHEMA = yup.object({
  email: yup.string().email('Enter a valid email').required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password should be of minimum 6 characters length')
    .required('Password is required'),
});

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function LoginPage() {
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: VALIDATION_SCHEMA,
    onSubmit: () => {
      mutation.mutate();
    },
  });

  const mutation = useMutation({
    mutationFn: () => {
      return stsService.login({
        email: formik.values.email,
        password: formik.values.password,
      });
    },
  });
  const isAuthorized = useAuthorization();

  useEffect(() => {
    if (mutation.isSuccess || isAuthorized) {
      navigate(HOME_PATH, { replace: true });
    }
  }, [mutation, navigate, isAuthorized]);

  return (
    <>
      {/* TODO: HANDLE MODAL ERROR */}
      <Modal
        open={mutation.isError}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style, width: 400 }}>
          <h2 id="parent-modal-title">Some thing went wrong</h2>
          <p id="parent-modal-description">
            {(mutation.error as DataFetchError)?.response.message}
          </p>
        </Box>
      </Modal>
      <Grid2 container spacing={2} sx={{ height: '100vh', width: '100vw' }}>
        <Grid2 size={2} />
        <Grid2 size={4} justifyContent="center" alignItems="center" display="flex">
          <XIcon
            sx={{
              fontSize: '20vw',
            }}
          />
        </Grid2>
        <Grid2 size={4} justifyContent="center" alignItems="center" display="flex">
          <Card
            variant="outlined"
            sx={{
              width: '450px',
              height: 'fit-content',
            }}
          >
            <CardContent>
              <Typography
                component="h1"
                variant="h4"
                sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
              >
                Sign in
              </Typography>
              <Box
                component="form"
                onSubmit={formik.handleSubmit}
                noValidate
                sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}
              >
                <FormControl>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <BootstrapInput
                    fullWidth
                    id="email"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                  />
                </FormControl>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <Link component="button" variant="body2" sx={{ alignSelf: 'baseline' }}>
                    Forgot your password?
                  </Link>
                </Box>
                <BootstrapInput
                  fullWidth
                  id="password"
                  name="password"
                  type="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.password && Boolean(formik.errors.password)}
                  helperText={formik.touched.password && formik.errors.password}
                />

                <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="Remember me"
                />

                <Button color="primary" variant="contained" fullWidth type="submit">
                  Submit
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid2>
        <Grid2 size={2} />
      </Grid2>
    </>
  );
}
