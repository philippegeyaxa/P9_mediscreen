package mediscreen.doctor.service;

import mediscreen.doctor.model.NoteDTO;
import mediscreen.doctor.model.PatientNotesDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import javax.validation.constraints.NotNull;
import java.util.List;

public interface NoteService {
    List<PatientNotesDTO> getAllGroupedByPatientId();
    Page<PatientNotesDTO> getPageSortByPatientId(Pageable pageRequest, @NotNull String e);
    PatientNotesDTO getAllByPatientId(long patientId);
    NoteDTO get(String noteId) throws NoteNotFoundException;
    NoteDTO postNoteByPatientId(long patientId, NoteDTO note) throws CreateExistingNoteException;
    List<NoteDTO> post(long patientId, int numberOfRandomRows);
    NoteDTO put(NoteDTO noteDTO) throws NoteNotFoundException;
}
