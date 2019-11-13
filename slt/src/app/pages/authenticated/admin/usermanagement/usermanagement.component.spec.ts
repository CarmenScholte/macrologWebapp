import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { UserManagementComponent } from './usermanagement.component';
import { AdminService } from '@app/services/admin.service';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { MatTableModule } from '@angular/material';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { UserAccount } from '@app/model/userAccount';
import { AlertService } from '@app/services/alert.service';

describe('UserManagementComponent', () => {
  let component: UserManagementComponent;
  let fixture: ComponentFixture<UserManagementComponent>;
  let adminService: AdminService;
  let alertService: AlertService;

  const allUsers = [
    { userName: 'CarmenDev', email: 'c.scholte.lubberink@gmail.com', id: 1, admin: false, token: '' },
    { userName: 'Arjan', email: 'c.scholte.lubberink@gmail.com', id: 2, admin: true, token: '' },
    { userName: 'Testtest', email: 'test@mailinator.com', id: 3, admin: false, token: '' }
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserManagementComponent],
      imports: [MatTableModule, HttpClientTestingModule],
      providers: [AdminService, AlertService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserManagementComponent);
    component = fixture.componentInstance;
    adminService = TestBed.get(AdminService);
    alertService = TestBed.get(AlertService);
    fixture.detectChanges();
  });

  it('should create usermanagement component', () => {
    expect(component).toBeTruthy();
  });

  it('should init usermanagement component', fakeAsync(() => {
    const adminSpy = spyOn(adminService, 'getAllUsers').and.returnValue(of(allUsers));
    component.ngOnInit();
    tick();
    fixture.detectChanges();
    expect(component.allUsers[0].userName).toEqual('CarmenDev');

    component.allUsers = undefined;
    adminSpy.and.returnValue(throwError({ status: 500 }));
    component.ngOnInit();
    tick();
    fixture.detectChanges();
    expect(component.allUsers).toEqual(undefined);
  }));

  it('should open and close delete user modal', fakeAsync(() => {
    const userAccount = new UserAccount();
    userAccount.id = 123;
    userAccount.userName = 'Test';
    component.openModalWithUser(userAccount);
    expect(component.isModalVisible).toBeTruthy();
    component.closeModal();
    expect(component.isModalVisible).toBeFalsy();
  }));

  it('should delete user', fakeAsync(() => {
    spyOn(adminService, 'deleteUser').and.returnValue(of({}));
    spyOn(alertService, 'setAlert');
    const userAccount = new UserAccount();
    userAccount.id = 123;
    component.selectedUser = userAccount;

    component.deleteUser();
    expect(adminService.deleteUser).toHaveBeenCalledWith(userAccount);
    tick();
    fixture.detectChanges();
    expect(alertService.setAlert).toHaveBeenCalledWith('User account deleted successfully!', false);
  }));

  it('should not delete user', fakeAsync(() => {
    spyOn(alertService, 'setAlert');
    spyOn(adminService, 'deleteUser').and.returnValue(throwError({ status: 401 }));
    const userAccount = new UserAccount();
    userAccount.id = 123;
    component.selectedUser = userAccount;

    component.deleteUser();
    expect(adminService.deleteUser).toHaveBeenCalledWith(userAccount);
    tick();
    fixture.detectChanges();
    expect(alertService.setAlert).toHaveBeenCalledWith('Could not delete user account: undefined', true);
  }));

});
