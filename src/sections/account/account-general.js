import { useState } from 'react';
import * as Yup from 'yup';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
// hooks
import { useMockedUser } from 'src/hooks/use-mocked-user';
// utils
import { fData } from 'src/utils/format-number';
// assets
import { countries } from 'src/assets/data';
// components
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFSwitch,
  RHFTextField,
  RHFUploadAvatar,
  RHFAutocomplete,
} from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function AccountGeneral({ data, client_id }) {
  const { enqueueSnackbar } = useSnackbar();
  const [ratingValue, setRatingValue] = useState(data.rating);
  console.log('data from tab', data);
  const {
    address,
    building_type,
    date_added,
    email,
    id,
    inspection_level,
    inspection_status,
    location,
    name,
    phone_number,
    rating,
  } = data;

  const { user } = useMockedUser();

  const UpdateUserSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    // photoURL: Yup.mixed().nullable().required('Avatar is required'),
    phone_number: Yup.string().required('Phone number is required'),
    location: Yup.string().required('location is required'),
    address: Yup.string().required('Address is required'),
    building_type: Yup.string().required('building_type is required'),
    // city: Yup.string().required('City is required'),
    // zipCode: Yup.string().required('Zip code is required'),
    // about: Yup.string().required('About is required'),
    // not required
    // isPublic: Yup.boolean(),
  });

  const defaultValues = {
    name: name || '',
    email: email || '',
    phone_number: phone_number || '',
    location: location || '',
    address: address || '',
    building_type: building_type || '',
    // rating: rating || '',
    // ispector: inspector.id || '',
    // country: user?.country || '',
    // address: address || '',
    // state: user?.state || '',
    // city: user?.city || '',
    // zipCode: user?.zipCode || '',
    // about: user?.about || '',
    // isPublic: user?.isPublic || false,
  };

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    alert('here');
    alert(ratingValue);
    var formdata = new FormData();
    formdata.append('id', client_id);
    formdata.append('name', data.name);
    formdata.append('email', data.email);
    formdata.append('phone_number', data.phone_number);
    formdata.append('location', data.location);
    formdata.append('address', data.address);
    formdata.append('building_type', data.building_type);
    formdata.append('rating', ratingValue);
    // formdata.append('inspector', data.inspector);

    var requestOptions = {
      method: 'PATCH',
      body: formdata,
      redirect: 'follow',
    };

    const res = await fetch('http://localhost:8000/client/update-client-profile/', requestOptions);
    const responseData = await res.json();
    if (res.status === 200) {
      enqueueSnackbar('Update success!');
    } else {
      enqueueSnackbar('Update Failed!');
    }
  });

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('photoURL', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Card sx={{ pt: 10, pb: 5, px: 3, textAlign: 'center' }}>
            {/* <RHFUploadAvatar
              name="photoURL"
              maxSize={3145728}
              onDrop={handleDrop}
              helperText={
                <Typography
                  variant="caption"
                  sx={{
                    mt: 3,
                    mx: 'auto',
                    display: 'block',
                    textAlign: 'center',
                    color: 'text.disabled',
                  }}
                >
                  Allowed *.jpeg, *.jpg, *.png, *.gif
                  <br /> max size of {fData(3145728)}
                </Typography>
              }
            /> */}
            <Typography
              variant="caption"
              sx={{
                // mt: 1,
                mb: 3,
                mx: 'auto',
                display: 'block',
                textAlign: 'center',
                color: 'white',
                fontWeight: 'bold',
              }}
            >
              ADVANCED
            </Typography>
            <Rating
              name="simple-controlled"
              value={ratingValue}
              onChange={(event, newValue) => {
                setRatingValue(newValue);
              }}
              sx={{ mb: 1 }}
              precision={0.5}
            />
            {/* <RHFTextField name="inspector" label="Inspector" value="Client" /> */}

            {/* <RHFSwitch
              name="isPublic"
              labelPlacement="start"
              label="Public Profile"
              sx={{ mt: 5 }}
            /> */}
            <Typography
              variant="caption"
              sx={{
                mt: 3,
                mx: 'auto',
                display: 'block',
                textAlign: 'center',
                color: 'white',
                fontWeight: 'bold',
              }}
            >
              CLIENT STATUS
            </Typography>

            <Button variant="soft" color="success" sx={{ mt: 3 }}>
              {inspection_status}
            </Button>
          </Card>
        </Grid>

        <Grid xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="name" label="Name" />
              <RHFTextField name="email" label="Email Address" />
              <RHFTextField name="phone_number" label="Phone Number" />
              <RHFTextField name="address" label="Address" />

              {/* <RHFAutocomplete
                name="country"
                label="Country"
                options={countries.map((country) => country.label)}
                getOptionLabel={(option) => option}
                renderOption={(props, option) => {
                  const { code, label, phone } = countries.filter(
                    (country) => country.label === option
                  )[0];

                  if (!label) {
                    return null;
                  }

                  return (
                    <li {...props} key={label}>
                      <Iconify
                        key={label}
                        icon={`circle-flags:${code.toLowerCase()}`}
                        width={28}
                        sx={{ mr: 1 }}
                      />
                      {label} ({code}) +{phone}
                    </li>
                  );
                }}
              /> */}

              <RHFTextField name="location" label="Location" />
              <RHFTextField name="building_type" label="Building Type" />
              {/* <RHFTextField name="zipCode" label="Zip/Code" /> */}
            </Box>

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              {/* <RHFTextField name="about" multiline rows={4} label="About" /> */}

              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Save Changes
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
