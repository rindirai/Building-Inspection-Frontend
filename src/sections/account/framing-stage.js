import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import ListItemText from '@mui/material/ListItemText';
import FormControlLabel from '@mui/material/FormControlLabel';
// components
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { useSnackbar } from 'src/components/snackbar';

// ----------------------------------------------------------------------
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Image from 'src/components/image';
import { Typography } from '@mui/material';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const NOTIFICATIONS = [
  {
    subheader: 'Framing',
    caption: 'Wall framing is plumb and aligned,',
    items: [
      {
        id: 'plumb_and_aligned_wall_framing',
        label: 'Wall framing is plumb and aligned',
      },
      {
        id: 'level_and_structurally_sound_floor_framing',
        label: ' Floor framing is level and structurally sound ',
      },
      {
        id: 'correctly_pitched_and_supported_roof_framing',
        label: 'Roof framing is correctly pitched and supported.',
      },
      {
        id: 'proper_use_of_fasteners_and_connectors',
        label: 'Correct fasteners and connectors are used.',
      },
      { id: 'meeting_load_bearing_requirements', label: 'Load-bearing requirements are met.' },
      { id: 'adherence_to_framing_spacing_plans', label: 'Framing spacing adheres to plans.' },
      {
        id: 'adequately_sized_and_installed_header_beams',
        label: 'Header beams are properly sized and installed.',
      },
      {
        id: 'compliant_fire_blocking_installed',
        label: 'Fire-blocking is installed as required.',
      },
    ],
  },
  //   {
  //     subheader: 'Application',
  //     caption: 'Donec mi odio, faucibus at, scelerisque quis',
  //     items: [
  //       { id: 'application_news', label: 'News and announcements' },
  //       { id: 'application_product', label: 'Weekly product updates' },
  //       { id: 'application_blog', label: 'Weekly blog digest' },
  //     ],
  //   },
];

// ----------------------------------------------------------------------

export default function AccountNotifications({ data, client_id }) {
  const { enqueueSnackbar } = useSnackbar();
  // Initialize state for the text field
  const [notes, setNotes] = useState(data.framing_inspection[0].notes);
  const [stageCompleted, setStageCompleted] = useState(data.framing_inspection[0].is_completed);

  // Define the onChange handler function
  const handleNotesChange = (event) => {
    setNotes(event.target.value);
  };
  const handleStageChange = (event) => {
    setStageCompleted(event.target.checked);
  };

  const [file, setFile] = useState(null);
  const [file2, setFile2] = useState(null);

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile);
  };

  const handleFile2Change = (event) => {
    const uploadedFile2 = event.target.files[0];
    setFile2(uploadedFile2);
  };
  console.log('framing data', data.framing_inspection[0]);
  function filterTrueValues(obj) {
    const result = [];
    for (const key in obj) {
      if (
        obj.hasOwnProperty(key) &&
        obj[key] === true &&
        key !== 'status' &&
        key !== 'is_completed'
      ) {
        result.push(key);
      }
    }
    return result;
  }
  const filteredObject = filterTrueValues(data.framing_inspection[0]);
  console.log(filteredObject);

  const methods = useForm({
    defaultValues: {
      selected: filteredObject,
    },
  });

  const {
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (values) => {
    var formdata = new FormData();

    values.selected.forEach((detail) => {
      console.log(detail);
      formdata.append(detail, 'true');
    });

    formdata.append('id', client_id);
    formdata.append('notes', notes);
    formdata.append('is_completed', stageCompleted);
    file && formdata.append('image1', file);
    file2 && formdata.append('image2', file2);

    var requestOptions = {
      method: 'PATCH',
      body: formdata,
      redirect: 'follow',
    };

    const res = await fetch('http://localhost:8000/client/update-framing/', requestOptions);
    const data = await res.json();

    if (res.status == 200) {
      enqueueSnackbar('Update success!');
    }

    // try {
    //   await new Promise((resolve) => setTimeout(resolve, 500));
    //   enqueueSnackbar('Update success!');
    //   console.info('FRAMING DATA', values.selected);
    // } catch (error) {
    //   console.error(error);
    // }
  });

  const getSelected = (selectedItems, item) =>
    selectedItems.includes(item)
      ? selectedItems.filter((value) => value !== item)
      : [...selectedItems, item];

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack component={Card} spacing={3} sx={{ p: 3 }}>
        {NOTIFICATIONS.map((notification) => (
          <Grid key={notification.subheader} container spacing={3}>
            <Grid xs={12} md={4}>
              <Stack
                spacing={{ xs: 1, sm: 2, lg: 10 }}
                direction="column"
                justifyContent="space-between"
                alignItems="stretch"
              >
                <ListItemText
                  primary={notification.subheader}
                  secondary={notification.caption}
                  primaryTypographyProps={{ typography: 'h6', mb: 0.5 }}
                  secondaryTypographyProps={{ component: 'span' }}
                />

                <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'background.neutral' }}>
                  <Grid container spacing={1} sx={{ mb: 2 }}>
                    <Grid xs={12} md={12}>
                      <Button
                        component="label"
                        variant="contained"
                        startIcon={<CloudUploadIcon />}
                        sx={{ width: '100%' }}
                      >
                        Upload Images 1
                        <VisuallyHiddenInput type="file" onChange={handleFileChange} />
                      </Button>
                    </Grid>
                    <Grid xs={12} md={12}>
                      <Button
                        component="label"
                        variant="contained"
                        startIcon={<CloudUploadIcon />}
                        sx={{ width: '100%' }}
                      >
                        Upload Images 2
                        <VisuallyHiddenInput type="file" onChange={handleFile2Change} />
                      </Button>
                    </Grid>
                  </Grid>
                  <RHFTextField
                    name="notes"
                    placeholder="Write Stage Notes Here"
                    multiline
                    rows={4}
                    value={notes} // Set the value of the text field to the state
                    onChange={handleNotesChange} // Attach the onChange handler
                  />
                  <FormControlLabel
                    label="Stage Completed"
                    labelPlacement="start"
                    control={<Switch checked={stageCompleted} onChange={handleStageChange} />}
                    sx={{ m: 0, width: 1, justifyContent: 'space-between' }}
                  />
                </Box>
              </Stack>
            </Grid>

            <Grid xs={12} md={8}>
              <Stack spacing={1} sx={{ p: 3, borderRadius: 2, bgcolor: 'background.neutral' }}>
                <Controller
                  name="selected"
                  control={control}
                  render={({ field }) => (
                    <>
                      {notification.items.map((item) => (
                        <FormControlLabel
                          key={item.id}
                          label={item.label}
                          labelPlacement="start"
                          control={
                            <Switch
                              checked={field.value.includes(item.id)}
                              onChange={() => field.onChange(getSelected(values.selected, item.id))}
                            />
                          }
                          sx={{ m: 0, width: 1, justifyContent: 'space-between' }}
                        />
                      ))}
                    </>
                  )}
                />
              </Stack>
            </Grid>
          </Grid>
        ))}

        <LoadingButton type="submit" variant="contained" loading={isSubmitting} sx={{ ml: 'auto' }}>
          Save Changes
        </LoadingButton>
      </Stack>
      <Stack component={Card} spacing={3} sx={{ p: 3, mt: 5 }}>
        <Grid container spacing={2}>
          <Grid xs={12} md={6}>
            {data.framing_inspection[0].image1 ? (
              <Image src={data.framing_inspection[0].image1} />
            ) : (
              <Typography>Please Upload First Image</Typography>
            )}
          </Grid>
          <Grid xs={12} md={6}>
            {data.framing_inspection[0].image2 ? (
              <Image src={data.framing_inspection[0].image2} />
            ) : (
              <Typography>Please Upload Second Image</Typography>
            )}
          </Grid>
        </Grid>
      </Stack>
    </FormProvider>
  );
}
