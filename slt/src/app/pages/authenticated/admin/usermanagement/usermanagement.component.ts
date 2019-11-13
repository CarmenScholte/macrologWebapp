import { Component, OnInit } from '@angular/core';
import { AdminService } from '@app/services/admin.service';
import { UserAccount } from '@app/model/userAccount';
import { AlertService } from '@app/services/alert.service';

@Component({
  selector: 'app-usermanagement',
  templateUrl: './usermanagement.component.html',
  styleUrls: ['./usermanagement.component.scss']
})
export class UserManagementComponent implements OnInit {

  public allUsers: UserAccount[];
  public isModalVisible = false;
  public userName: string;
  public displayedColumns: string[] = ['id', 'name', 'email', 'delete'];

  public selectedUser: UserAccount;

  constructor(private adminService: AdminService,
    private alertService: AlertService) { }

  ngOnInit() {
    this.getAllUsers();
  }

  private getAllUsers() {
    this.adminService.getAllUsers().subscribe(
      res => {
        this.allUsers = res;
      },
      err => {
        this.alertService.setAlert('Could not get all users: ' + err.error, true);
      }
    );
  }

  public closeModal() {
    this.isModalVisible = false;
  }

  public openModalWithUser(user: UserAccount) {
    this.selectedUser = user;
    this.isModalVisible = true;
  }

  public deleteUser() {
    this.adminService.deleteUser(this.selectedUser).subscribe(
      () => {
        this.alertService.setAlert('User account deleted successfully!', false);
        this.getAllUsers();
      },
      err => {
        this.alertService.setAlert('Could not delete user account: ' + err.error, true);
      },
      () => {
        this.selectedUser = undefined;
        this.closeModal();
      });
  }
}
