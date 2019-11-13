import { TestBed } from '@angular/core/testing';
import { WeightService } from './weight.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AlertService } from './alert.service';

describe('WeightService', () => {
	let service: WeightService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			providers: [WeightService, AlertService]
		});
		service = TestBed.get(WeightService);
	});

	afterEach(() => {
		localStorage.clear();
	});

	it('should create service', () => {
		expect(service).toBeTruthy();
	});

});

