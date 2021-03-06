package mediscreen.report.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import feign.Response;
import mediscreen.report.client.PatientClient;
import mediscreen.report.model.PatientData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class PatientServiceImpl implements PatientService {

    @Autowired
    PatientClient client;

    @Autowired
    ObjectMapper objectMapper;

    @Override
    public PatientData get(long patientId)
            throws IOException, PatientNotFoundException {
        Response response = client.get(patientId);
        if (response.status() == HttpStatus.OK.value()) {
            return objectMapper.readValue(response.body().asInputStream(), PatientData.class);
        }
        throw new PatientNotFoundException(
                "Could not find patient with id " + patientId +
                " : received return code " + response.status() + " from API."
        );
    }

    @Override
    public PatientData get(String family) throws PatientNotFoundException, PatientNotUniqueException {
        Page<PatientData> patientDataPage = client.getPage(
                PageRequest.of(0,10),
                "",
                family,
                "");
        int size = patientDataPage.getSize();
        switch (size) {
            case 0:
                throw new PatientNotFoundException(
                        "Could not find patient with name " + family +
                        " : received empty page as response from API."
                );
            case 1:
                return patientDataPage.getContent().get(0);
            default:
                throw new PatientNotUniqueException(
                        "Could not find patient with name " + family +
                        " : received " + size + " matches from API."
                );
        }
    }

    @Override
    public Page<PatientData> getPage(Pageable pageRequest) {
        return client.getPage(pageRequest, null, null, null);
    }

    @Override
    public Page<PatientData> getPage(Pageable pageRequest, String filterId, String filterFamily) {
        return client.getPage(pageRequest, filterId, filterFamily, null);
    }
}
