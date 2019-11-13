import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DiaryService } from './diary.service';
import { LogEntry } from '@app/model/logEntry';
import { StoreLogRequest } from '@app/model/storeLogRequest';
import { AlertService } from './alert.service';

describe('DiaryService', () => {
    let service: DiaryService;
    let http: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [DiaryService, AlertService]
        });
        service = TestBed.get(DiaryService);
        http = TestBed.get(HttpTestingController);
    });

    afterEach(() => {
        localStorage.clear();
    });

    it('should create service', () => {
        expect(service).toBeTruthy();
    });

    it('should get logs for a day', fakeAsync(() => {
        const mockLog = new LogEntry();
        mockLog.id = 123;
        const mockResponse = [mockLog];
        service.getLogsForDay('2019-01-01').subscribe(
            res => {
                expect(res[0].id).toEqual(123);
            }
        );
        const request = http.expectOne(service.macrologBackendUrl + '/day/2019-01-01');
        expect(request.request.method).toEqual('GET');
        request.flush(mockResponse);
        tick();
        http.verify();
    }));

    it('should get macros', fakeAsync(() => {
        const mockResponse = [{ macro: 'macro' }];
        service.getMacrosPerDay('2019-01-01', '2019-01-02').subscribe(
            res => {
                expect(res[0].macro).toEqual('macro');
            }
        );
        const request = http.expectOne(service.macrologBackendUrl + '/macros?from=2019-01-01&to=2019-01-02');
        expect(request.request.method).toEqual('GET');
        request.flush(mockResponse);
        tick();
        http.verify();
    }));

    it('should store log entries', fakeAsync(() => {
        const mockStoreLog = new StoreLogRequest();
        let result = false;
        const mockCallback = () => {
            result = true;
        };
        mockStoreLog.id = 123;
        const mockResponse = [mockStoreLog];
        service.storeLogEntries(mockResponse, mockCallback);
        const request = http.expectOne(service.macrologBackendUrl + '/');
        expect(request.request.method).toEqual('POST');
        request.flush(mockResponse);
        tick();
        http.verify();
        expect(result).toBeTruthy();
    }));

    it('should delete log entry', fakeAsync(() => {
        const mockLog = new LogEntry();
        mockLog.id = 123;
        service.deleteLogEntry(mockLog);
        const request = http.expectOne(service.macrologBackendUrl + '/' + 123);
        expect(request.request.method).toEqual('DELETE');
        request.flush({ status: 200 });
        tick();
        http.verify();
    }));
});
