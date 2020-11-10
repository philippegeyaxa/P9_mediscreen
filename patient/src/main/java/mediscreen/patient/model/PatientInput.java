package mediscreen.patient.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Past;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Positive;
import java.util.Date;

@FieldDefaults(level=AccessLevel.PUBLIC)
@NoArgsConstructor
@AllArgsConstructor
public class PatientInput {
    @NotBlank(message="Family name must contain at least one non-whitespace character")
    String family;

    @NotBlank(message="Given name must contain at least one non-whitespace character")
    String given;

    @NotNull(message="Date of birth may not be null")
    @Past(message="Date of birth must be a date in the past with format yyyy-mm-dd")
    @JsonFormat(pattern="yyyy-mm-dd")
    Date dob;

    @NotNull(message="Sex may not be null")
    @Pattern(regexp = "^[M|F]{1}$", message ="Sex must be M or F")
    String sex;

    @NotBlank(message="Address must contain at least one non-whitespace character")
    String address;

    @NotBlank(message="Phone number must contain at least one non-whitespace character")
    @Pattern(regexp = ".*[- +()0-9]", message="Phone number may only include plus sign, spaces, digits, brackets and dashes")
    String phone;
}
