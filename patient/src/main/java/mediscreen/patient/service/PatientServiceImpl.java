package mediscreen.patient.service;

import mediscreen.patient.model.PatientEntity;
import mediscreen.patient.model.PatientDTO;
import mediscreen.patient.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PatientServiceImpl implements PatientService {
    @Autowired
    PatientRepository repository;

    @Override
    public List<PatientDTO> getList() {
        return repository.findAll().stream().map(PatientDTO::new).collect(Collectors.toList());
    }

    @Override
    public PatientDTO get(long patientId) throws PatientNotFoundException {
        Optional<PatientEntity> patient = repository.findById(patientId);
        if (patient.isPresent()) return new PatientDTO(patient.get());
        throw new PatientNotFoundException();
    }

    @Override
    public PatientDTO put(PatientDTO patient) throws PatientNotFoundException {
        Optional<PatientEntity> optional = repository.findById(patient.id);
        if (optional.isPresent()) {
            PatientEntity result = repository.save(optional.get());
            if (result != null) return new PatientDTO(result);
            throw new PatientNotFoundException();
        }
        throw new PatientNotFoundException();
    }
}