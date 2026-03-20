import { Box, TextField, Button, Select, MenuItem } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";

const UserFormFields = ({
  formData, setFormData, errors,
  countries, statesList, citiesList,
}) => {
  return (
    <Box display="flex" flexDirection="column" gap={2} mt={1}>

      <TextField
        label="Name"
        value={formData.name}
        error={!!errors.name}
        helperText={errors.name}
        onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
      />

      <TextField
        label="Email"
        value={formData.email}
        error={!!errors.email}
        helperText={errors.email}
        onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
      />

      <Select
        value={formData.gender}
        displayEmpty
        onChange={e => setFormData(prev => ({ ...prev, gender: e.target.value }))}
      >
        <MenuItem value="" disabled>Select Gender</MenuItem>
        <MenuItem value="Male">Male</MenuItem>
        <MenuItem value="Female">Female</MenuItem>
      </Select>
      {errors.gender && (
        <Box color="error.main" fontSize="12px">{errors.gender}</Box>
      )}

      {!(formData.image instanceof File) && !formData.image ? (
        <Button component="label" variant="outlined">
          Upload Image
          <input
            hidden
            type="file"
            accept="image/*"
            onChange={e => {
              const file = e.target.files[0];
              if (file) {
                setFormData(prev => ({ ...prev, image: file, imageName: file.name }));
              }
            }}
          />
        </Button>
      ) : (
        <Box display="flex" alignItems="center" gap={2}>
          <img
            src={
              formData.image instanceof File
                ? URL.createObjectURL(formData.image)
                : formData.image
            }
            alt="preview"
            style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover" }}
          />
          <Box fontSize="14px">
            {formData.image instanceof File ? formData.imageName : "Current image"}
          </Box>
          <Button
            size="small"
            color="error"
            variant="outlined"
            onClick={() => setFormData(prev => ({ ...prev, image: null, imageName: "" }))}
          >
            Remove
          </Button>
        </Box>
      )}

      <Box display="flex" gap={2}>
        <Select
          value={formData.countryCode}
          sx={{ width: 140 }}
          onChange={e => setFormData(prev => ({ ...prev, countryCode: e.target.value }))}
        >
          <MenuItem value="+91">+91 (India)</MenuItem>
          <MenuItem value="+1">+1 (USA)</MenuItem>
          <MenuItem value="+44">+44 (UK)</MenuItem>
        </Select>

        <TextField
          label="Contact Number"
          value={formData.contact}
          error={!!errors.contact}
          helperText={errors.contact}
          onChange={e => {
            let val = e.target.value.replace(/[^0-9]/g, "");
            if (val.length > 10) val = val.slice(0, 10);
            setFormData(prev => ({ ...prev, contact: val }));
          }}
          fullWidth
        />
      </Box>

      <TextField
        label="Address"
        multiline
        rows={3}
        value={formData.address}
        error={!!errors.address}
        helperText={errors.address}
        onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))}
      />

      <Autocomplete
        options={countries.map(c => c.name)}
        value={formData.country}
        onChange={(e, v) =>
          setFormData(prev => ({ ...prev, country: v, state: "", city: "" }))
        }
        renderInput={(params) => (
          <TextField {...params} label="Country"
            error={!!errors.country} helperText={errors.country} />
        )}
      />

      <Autocomplete
        options={statesList.map(s => s.name)}
        value={formData.state}
        onChange={(e, v) =>
          setFormData(prev => ({ ...prev, state: v, city: "" }))
        }
        renderInput={(params) => (
          <TextField {...params} label="State"
            error={!!errors.state} helperText={errors.state} />
        )}
      />

      <Autocomplete
        options={citiesList.map(c => c.name)}
        value={formData.city}
        onChange={(e, v) =>
          setFormData(prev => ({ ...prev, city: v }))
        }
        renderInput={(params) => (
          <TextField {...params} label="City"
            error={!!errors.city} helperText={errors.city} />
        )}
      />

    </Box>
  );
};

export default UserFormFields;